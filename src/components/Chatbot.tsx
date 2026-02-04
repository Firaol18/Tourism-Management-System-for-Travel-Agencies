"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text:
        "👋 Welcome to TMS Support! I can help you with bookings, tour packages, payments, cancellations, and general questions. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ===============================
  // Agency Knowledge Base / FAQ
  // ===============================
  const faqResponses = {
    booking:
      "📦 To book a tour, simply select a package, choose your travel dates, and click **Book Now**. You can view all your bookings in the *My Bookings* section.",
    payment:
      "💳 Payments are handled securely. Available methods depend on your selected package. You’ll see payment details during checkout.",
    cancel:
      "❌ You can cancel a booking from *My Bookings*. Cancellation policies depend on the tour package and booking date.",
    refund:
      "💰 Refund eligibility depends on the package rules. If your booking qualifies, refunds are processed after admin approval.",
    packages:
      "🧳 We offer a wide range of tour packages across Ethiopia and beyond — cultural tours, adventure trips, and custom travel plans.",
    enquiry:
      "📨 You can send an enquiry using the Enquiry page. Our team will respond as soon as possible.",
    support:
      "🛠 If you face any issues, open a ticket from the *Issue Tickets* page. Our support team will assist you.",
    admin:
      "🔐 Admin users can manage packages, bookings, users, and enquiries through the admin dashboard.",
    contact:
      "📞 You can contact us via the Contact page or email us at **info@tms.com**.",
    location:
      "📍 Our main office is located in Addis Ababa, Ethiopia.",
    greeting:
      "Hello! 😊 I’m here to help with anything related to Tourism Management System.",
    thanks:
      "You’re welcome! 🙌 If you need anything else, just ask.",
  }

  const getResponse = (message: string): string => {
    const text = message.toLowerCase()

    if (text.includes("book")) return faqResponses.booking
    if (text.includes("payment") || text.includes("pay")) return faqResponses.payment
    if (text.includes("cancel")) return faqResponses.cancel
    if (text.includes("refund")) return faqResponses.refund
    if (text.includes("package") || text.includes("tour")) return faqResponses.packages
    if (text.includes("enquiry") || text.includes("question")) return faqResponses.enquiry
    if (text.includes("issue") || text.includes("support") || text.includes("help"))
      return faqResponses.support
    if (text.includes("admin")) return faqResponses.admin
    if (text.includes("contact") || text.includes("email") || text.includes("phone"))
      return faqResponses.contact
    if (text.includes("where") || text.includes("location")) return faqResponses.location
    if (text.includes("hi") || text.includes("hello")) return faqResponses.greeting
    if (text.includes("thank")) return faqResponses.thanks

    return (
      "🤖 I can help with:\n" +
      "• Booking tours\n" +
      "• Payments & refunds\n" +
      "• Cancellations\n" +
      "• Tour packages\n" +
      "• Support tickets\n\n" +
      "Please type your question."
    )
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(userMessage.text),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 900)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
        >
          {isOpen ? <X /> : <MessageCircle />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="fixed bottom-24 right-6 z-40 w-80 h-[420px]"
          >
            <Card className="h-full flex flex-col shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  TMS Support
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-4 pb-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            msg.sender === "user"
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="text-sm text-muted-foreground">Typing...</div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-3 border-t flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about bookings, payments..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
