export interface User {
    id: number
    fullName: string
    mobileNumber: string
    emailId: string
    regDate: Date
    updationDate: Date
}

export interface TourPackage {
    id: number
    packageName: string
    packageType: string
    packageLocation: string
    packagePrice: number
    packageFeatures: string
    packageDetails: string
    packageImage: string
    creationDate: Date
    updationDate: Date | null
}

export interface Booking {
    id: number
    packageId: number
    userEmail: string
    fromDate: string
    toDate: string
    comment: string
    regDate: Date
    status: number // 0=pending, 1=confirmed, 2=cancelled
    cancelledBy: string | null // 'a'=admin, 'u'=user
    updationDate: Date | null
    package?: TourPackage
    user?: User
}

export interface Enquiry {
    id: number
    fullName: string
    emailId: string
    mobileNumber: string
    subject: string
    description: string
    postingDate: Date
    status: number | null
}

export interface Issue {
    id: number
    userEmail: string
    issue: string
    description: string
    postingDate: Date
    adminRemark: string | null
    adminRemarkDate: Date | null
    user?: User
}

export interface Page {
    id: number
    type: string
    detail: string
}

export interface Admin {
    id: number
    username: string
    updationDate: Date
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type UserRole = 'user' | 'admin'
