"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import AdminLogout from './AdminLogout'

export default function AdminProfileDropdown({ name = 'Administrator' }: { name?: string }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-3 hover:text-gray-300 px-2 py-1 rounded"
                aria-expanded={open}
            >
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">{(name || 'A').charAt(0)}</span>
                <span className="hidden sm:block text-sm">{name}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50">
                    <Link href="/admin/profile" className="block px-4 py-2 hover:bg-gray-100">
                        Profile
                    </Link>
                    <Link href="/admin/change-password" className="block px-4 py-2 hover:bg-gray-100">
                        Change Password
                    </Link>
                    <div className="border-t" />
                    <div className="px-4 py-2">
                        <AdminLogout />
                    </div>
                </div>
            )}
        </div>
    )
}
