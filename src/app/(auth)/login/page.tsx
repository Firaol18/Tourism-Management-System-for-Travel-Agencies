import LoginForm from '@/components/auth/LoginForm'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function LoginPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-12">
                <LoginForm />
            </main>
            <Footer />
        </>
    )
}
