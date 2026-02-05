import { format as dateFnsFormat, Locale } from 'date-fns'
import { enUS } from 'date-fns/locale'

const locales: Record<string, Locale> = {
    en: enUS,
    am: enUS // Fallback to English for Amharic dates until proper locale is available
}

export function formatDate(date: Date | string, formatStr: string = 'PPP', locale: string = 'en') {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateFnsFormat(dateObj, formatStr, { locale: locales[locale] || enUS })
}

export function formatCurrency(amount: number, locale: string = 'en') {
    const currencyLocale = locale === 'am' ? 'am-ET' : 'en-US'
    return new Intl.NumberFormat(currencyLocale, {
        style: 'currency',
        currency: 'ETB', // Ethiopian Birr
        minimumFractionDigits: 0
    }).format(amount)
}

export function formatNumber(num: number, locale: string = 'en') {
    const numberLocale = locale === 'am' ? 'am-ET' : 'en-US'
    return new Intl.NumberFormat(numberLocale).format(num)
}

export function formatRelativeTime(date: Date | string, locale: string = 'en') {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat(locale === 'am' ? 'am-ET' : 'en-US', { numeric: 'auto' })

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second')
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
    if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
    if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
}
