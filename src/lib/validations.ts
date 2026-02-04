import { z } from 'zod'

// User Registration Schema
export const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
    emailId: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type RegisterInput = z.infer<typeof registerSchema>

// User Login Schema
export const loginSchema = z.object({
    emailId: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Booking Schema
export const bookingSchema = z.object({
    packageId: z.number(),
    fromDate: z.string().min(1, 'From date is required'),
    toDate: z.string().min(1, 'To date is required'),
    comment: z.string().min(1, 'Comment is required'),
})

export type BookingInput = z.infer<typeof bookingSchema>

// Enquiry Schema
export const enquirySchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    emailId: z.string().email('Invalid email address'),
    mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
})

export type EnquiryInput = z.infer<typeof enquirySchema>

// Issue Schema
export const issueSchema = z.object({
    issue: z.string().min(3, 'Issue title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
})

export type IssueInput = z.infer<typeof issueSchema>

// Package Schema (Admin)
export const packageSchema = z.object({
    packageName: z.string().min(3, 'Package name must be at least 3 characters'),
    packageType: z.string().min(1, 'Package type is required'),
    packageLocation: z.string().min(1, 'Package location is required'),
    packagePrice: z.number().min(1, 'Package price must be greater than 0'),
    packageFeatures: z.string().min(1, 'Package features are required'),
    packageDetails: z.string().min(10, 'Package details must be at least 10 characters'),
    packageImage: z.string().optional(),
})

export type PackageInput = z.infer<typeof packageSchema>

// Change Password Schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
