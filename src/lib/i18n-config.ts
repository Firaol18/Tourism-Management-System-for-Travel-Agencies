// Simple i18n configuration without routing
export const locales = ['en', 'am'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

// Load messages based on locale
export async function getMessages(locale: Locale) {
    try {
        return (await import(`../../messages/${locale}.json`)).default
    } catch (error) {
        return (await import(`../../messages/en.json`)).default
    }
}
