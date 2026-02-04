'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { SignInModal, SignUpModal } from './AuthModals'

interface AuthLinksProps {
    user: {
        name?: string | null
        email?: string | null
    } | null
}

export default function AuthLinks({ user }: AuthLinksProps) {
    const [isSignInOpen, setIsSignInOpen] = useState(false)
    const [isSignUpOpen, setIsSignUpOpen] = useState(false)

    if (user) {
        return (
            <>
                <li className="text-white bg-tms-blue px-3 py-1 flex items-center">
                    <span className="opacity-80 mr-2">Welcome :</span> {user.email}
                </li>
                <li>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-white hover:text-gray-200 font-semibold"
                    >
                        / Logout
                    </button>
                </li>
            </>
        )
    }

    return (
        <>
            <li className="text-white font-semibold">Toll Number: +1251-920443110</li>
            <li>
                <button
                    onClick={() => setIsSignUpOpen(true)}
                    className="text-white hover:text-gray-200 font-semibold"
                >
                    Sign Up
                </button>
            </li>
            <li>
                <button
                    onClick={() => setIsSignInOpen(true)}
                    className="text-white hover:text-gray-200 font-semibold border-l border-white/30 pl-3 ml-1"
                >
                    Sign In
                </button>
            </li>

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                onSwitchToSignUp={() => {
                    setIsSignInOpen(false)
                    setIsSignUpOpen(true)
                }}
            />
            <SignUpModal
                isOpen={isSignUpOpen}
                onClose={() => setIsSignUpOpen(false)}
                onSwitchToSignIn={() => {
                    setIsSignUpOpen(false)
                    setIsSignInOpen(true)
                }}
            />
        </>
    )
}
