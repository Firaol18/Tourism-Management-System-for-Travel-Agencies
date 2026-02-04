# TMS Next.js - Modern Tourism Management System

A modern, high-performance tourism management system built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### User Features
- 🔐 Secure authentication with NextAuth.js
- 📦 Browse and search tour packages
- 🎫 Book packages with date selection
- 📝 View booking history
- 🎟️ Raise support tickets/issues
- 👤 Manage profile and change password
- 📧 Submit enquiries

### Admin Features
- 📊 Dashboard with comprehensive statistics
- ✏️ Manage packages (CRUD operations)
- 📋 Manage bookings (confirm/cancel)
- 👥 User management
- 📬 Handle enquiries and issues
- 📄 CMS for static pages

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Validation:** Zod
- **Password Hashing:** bcrypt

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a PostgreSQL database:

```bash
createdb tms
```

### 3. Configure Environment

Copy `.env.local.example` to `.env.local` and update:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/tms"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 4. Set Up Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create database schema
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### 5. Migrate Data

See `migration_guide.md` for detailed instructions on migrating from MySQL.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nextjs/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   └── images/                # Static images
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── (user)/           # User dashboard pages
│   │   ├── (public)/         # Public pages
│   │   ├── admin/            # Admin panel
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   └── forms/           # Form components
│   ├── lib/                  # Utility libraries
│   │   ├── db.ts            # Prisma client
│   │   ├── auth.ts          # Auth config
│   │   ├── utils.ts         # Helper functions
│   │   └── validations.ts   # Zod schemas
│   ├── types/                # TypeScript types
│   └── hooks/                # Custom hooks
├── .env.local                 # Environment variables
├── next.config.js            # Next.js config
├── tailwind.config.js        # Tailwind config
└── tsconfig.json             # TypeScript config
```

## 🗄️ Database Schema

### Tables

- `admin` - Admin users
- `tblusers` - Regular users
- `tbltourpackages` - Tour packages
- `tblbooking` - Package bookings
- `tblenquiry` - User enquiries
- `tblissues` - Support tickets
- `tblpages` - CMS pages (about, privacy, terms, contact)

## 🔑 Authentication

- Session-based authentication using NextAuth.js
- JWT tokens for session management
- bcrypt for password hashing
- Protected routes for user and admin areas
- Role-based access control

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 🔒 Security Features

- ✅ bcrypt password hashing
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection (React auto-escaping)
- ✅ CSRF protection (NextAuth.js)
- ✅ Input validation (Zod)
- ✅ HTTP-only cookies
- ✅ Secure session management

## 📚 Documentation

- [Migration Guide](../brain/migration_guide.md) - Database migration instructions
- [Implementation Plan](../brain/implementation_plan.md) - Detailed technical plan
- [Additional Recommendations](../brain/additional_recommendations.md) - Future enhancements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues and questions:
- Check the migration guide
- Review implementation plan
- Open an issue

## 🎯 Roadmap

- [x] Project setup
- [x] Database schema
- [x] Authentication configuration
- [ ] API routes implementation
- [ ] UI components
- [ ] Admin panel
- [ ] User dashboard
- [ ] Testing
- [ ] Deployment

---

Built with ❤️ using Next.js 14
