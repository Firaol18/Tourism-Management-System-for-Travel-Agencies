# Quick Start Guide

## Before Running

You need to complete these steps:

### 1. Install PostgreSQL (if not installed)
Download from: https://www.postgresql.org/download/windows/

### 2. Create Database
```bash
# Open Command Prompt or PowerShell
createdb tms

# OR using psql
psql -U postgres
CREATE DATABASE tms;
\q
```

### 3. Update Environment Variables
Edit `.env.local` file and update:
- `DATABASE_URL` with your PostgreSQL password
- `NEXTAUTH_SECRET` - generate with: `openssl rand -base64 32`

### 4. Push Database Schema
```bash
npx prisma db push
```

### 5. (Optional) Seed Database
You can add some test data or migrate from MySQL using the migration guide.

### 6. Run Development Server
```bash
npm run dev
```

Open: http://localhost:3000

## Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database 'tms' exists

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```
