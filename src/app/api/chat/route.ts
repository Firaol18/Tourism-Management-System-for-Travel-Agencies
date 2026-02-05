import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { openai, CHATBOT_SYSTEM_PROMPT, AMHARIC_SYSTEM_PROMPT } from '@/lib/openai'
import { prisma } from '@/lib/db'

interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
}

interface ChatRequest {
    messages: Message[]
    locale?: string
}

// Helper function to detect language
function detectLanguage(text: string): 'en' | 'am' {
    // Simple detection: if text contains Ethiopic characters, it's Amharic
    const ethiopicPattern = /[\u1200-\u137F]/
    return ethiopicPattern.test(text) ? 'am' : 'en'
}

// Helper function to get context about packages
async function getPackageContext(query: string) {
    try {
        // Search for relevant packages based on query
        const packages = await prisma.tourPackage.findMany({
            where: {
                OR: [
                    { packageName: { contains: query, mode: 'insensitive' } },
                    { packageLocation: { contains: query, mode: 'insensitive' } },
                    { packageType: { contains: query, mode: 'insensitive' } },
                    { packageDetails: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 5,
            select: {
                id: true,
                packageName: true,
                packageType: true,
                packageLocation: true,
                packagePrice: true,
                packageDetails: true,
                packageFeatures: true,
                isAvailable: true
            }
        })

        if (packages.length > 0) {
            return `\n\nRelevant Packages:\n${packages.map(pkg =>
                `- ${pkg.packageName} (${pkg.packageType}) in ${pkg.packageLocation}: $${pkg.packagePrice} - ${pkg.packageDetails.substring(0, 100)}...`
            ).join('\n')}`
        }
        return ''
    } catch (error) {
        console.error('Error fetching package context:', error)
        return ''
    }
}

// Helper function to get user booking context
async function getUserBookingContext(userEmail: string) {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userEmail },
            take: 3,
            orderBy: { regDate: 'desc' },
            include: {
                package: {
                    select: {
                        packageName: true,
                        packageLocation: true
                    }
                }
            }
        })

        if (bookings.length > 0) {
            return `\n\nUser's Recent Bookings:\n${bookings.map(booking =>
                `- ${booking.package.packageName} (${booking.status === 1 ? 'Confirmed' : booking.status === 0 ? 'Pending' : 'Cancelled'})`
            ).join('\n')}`
        }
        return ''
    } catch (error) {
        console.error('Error fetching booking context:', error)
        return ''
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const { messages, locale = 'en' }: ChatRequest = await request.json()

        if (!messages || messages.length === 0) {
            return NextResponse.json(
                { error: 'Messages are required' },
                { status: 400 }
            )
        }

        // Get the last user message
        const lastUserMessage = messages[messages.length - 1]
        if (lastUserMessage.role !== 'user') {
            return NextResponse.json(
                { error: 'Last message must be from user' },
                { status: 400 }
            )
        }

        // Detect language from user message
        const detectedLocale = detectLanguage(lastUserMessage.content)
        const systemPrompt = detectedLocale === 'am' ? AMHARIC_SYSTEM_PROMPT : CHATBOT_SYSTEM_PROMPT

        // Get context
        let contextInfo = ''

        // Add package context if query seems to be about packages
        const packageKeywords = ['package', 'tour', 'trip', 'destination', 'visit', 'ፓኬጅ', 'ጉዞ', 'መድረሻ']
        if (packageKeywords.some(keyword => lastUserMessage.content.toLowerCase().includes(keyword))) {
            contextInfo += await getPackageContext(lastUserMessage.content)
        }

        // Add user booking context if logged in
        if (session?.user?.email) {
            contextInfo += await getUserBookingContext(session.user.email)
        }

        // Prepare messages for OpenAI
        const openaiMessages: any[] = [
            {
                role: 'system',
                content: systemPrompt + contextInfo
            },
            ...messages.slice(-10) // Keep last 10 messages for context
        ]

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: openaiMessages,
            temperature: 0.7,
            max_tokens: 500,
            presence_penalty: 0.6,
            frequency_penalty: 0.3
        })

        const assistantMessage = completion.choices[0].message.content

        return NextResponse.json({
            message: assistantMessage,
            locale: detectedLocale
        })

    } catch (error: any) {
        console.error('Chatbot API error:', error)

        if (error?.status === 401) {
            return NextResponse.json(
                { error: 'Invalid OpenAI API key' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        )
    }
}
