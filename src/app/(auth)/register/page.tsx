import RegisterForm from '@/components/auth/RegisterForm'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function RegisterPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-12">
                <RegisterForm />
            </main>
            <Footer />
        </>
    )
}
