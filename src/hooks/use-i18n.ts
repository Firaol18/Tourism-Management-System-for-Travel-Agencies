import { useTranslations } from 'next-intl'

export function useI18n() {
    const t = useTranslations()

    return {
        t,
        common: useTranslations('common'),
        nav: useTranslations('nav'),
        auth: useTranslations('auth'),
        packages: useTranslations('packages'),
        bookings: useTranslations('bookings'),
        reviews: useTranslations('reviews'),
        admin: useTranslations('admin'),
        newsletter: useTranslations('newsletter'),
        social: useTranslations('social'),
        footer: useTranslations('footer'),
        errors: useTranslations('errors'),
        validation: useTranslations('validation')
    }
}
