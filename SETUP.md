# TMS Next.js - Quick Setup Instructions

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

## Setup Steps

### 1. Install Dependencies (Already Done ✓)
```bash
npm install
```

### 2. Set Up PostgreSQL

**Option A: Using Command Line**
```bash
# Create database
createdb tms
```

**Option B: Using psql**
```bash
psql -U postgres
CREATE DATABASE tms;
\q
```

### 3. Configure Environment

```bash
# Copy example file
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/tms"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### 4. Set Up Database Schema

```bash
# Generate Prisma Client (Already Done ✓)
npx prisma generate

# Create database tables
npx prisma db push
```

### 5. Optional: Migrate Data from MySQL

See `migration_guide.md` for detailed instructions.

Quick migration:
```bash
# Using pgloader (recommended)
pgloader mysql://root@localhost/tms postgresql://postgres:password@localhost/tms
```

### 6. Copy Package Images

```bash
# Windows
xcopy /E /I ..\tms\admin\pacakgeimages public\images\packages

# Mac/Linux
cp -r ../tms/admin/pacakgeimages public/images/packages
```

### 7. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Troubleshooting

### Prisma Client Error
If you see "Cannot find module '@prisma/client'":
```bash
npx prisma generate
```
Then restart your IDE/TypeScript server.

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env.local
- Ensure database 'tms' exists

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

## VS Code Extensions (Recommended)

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## Next Steps

After setup, you can:
1. View the home page at http://localhost:3000
2. Check Prisma Studio: `npx prisma studio`
3. Start building features!

For detailed documentation, see:
- `README.md` - Full project documentation
- `migration_guide.md` - Data migration
- `walkthrough.md` - What's been built
