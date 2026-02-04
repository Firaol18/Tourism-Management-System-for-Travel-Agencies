'use client'

import { signOut } from 'next-auth/react'

export default function AdminLogout() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="hover:text-gray-300"
        >
            Logout
        </button>
    )
}
