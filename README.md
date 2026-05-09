# Light TV - Next.js Streaming Platform

A modern, fast streaming platform built with Next.js, React, and Supabase featuring movies, TV series, anime, and live TV capabilities.

## Features

- 🎬 **Multiple Content Types**: Movies, TV Series, Anime, and Live TV sections
- 👤 **User Registration & Authentication**: IP-based anti-hit-and-run system
- 👨‍💼 **Admin Panel**: Manage user registrations and approvals at `/lighttvadminvin`
- 🎨 **Printer Animation**: Creative printer paper cutting animation for registration status
- 🔍 **Advanced Search**: Search across all content types
- 💰 **Referral Program**: Built-in referral system with shareable links
- 🚫 **Anti-Ads System**: Built-in ad blocker to prevent tracking and ads
- 🌙 **Dark Mode**: Beautiful dark theme optimized for streaming
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom session-based auth with Supabase
- **Styling**: Tailwind CSS
- **Security**: IP tracking, password hashing with bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `ADMIN_SECRET`: Your admin panel secret

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### User Flow

1. **Registration** (`/register`): Users create an account with username, phcorner user, and password
2. **Printer Animation**: Shows approval status with animated printer paper cutting
3. **Admin Approval** (`/lighttvadminvin`): Admins can approve/reject pending users
4. **Dashboard** (`/dashboard`): Approved users access the streaming content

### Admin Panel

Access the admin panel at `/lighttvadminvin` using your admin secret:
- View all pending registrations
- Approve or reject user accounts
- Track registration status and IP addresses

### Search

Use the search functionality to find content across all categories (movies, TV series, anime)

### Referral Program

Share the referral link: `https://v0.app/ref/WKEGIU`

## Project Structure

```
/app
  /register          - User registration page
  /login            - Login page
  /dashboard        - Main streaming dashboard
  /settings         - User settings
  /pending          - Pending approval page
  /rejected         - Rejected registration page
  /lighttvadminvin  - Admin panel
  /api
    /auth           - Authentication routes
    /admin          - Admin routes
    /content        - Content data routes
    /search         - Search functionality

/components
  /header           - Main navigation header
  /content-section  - Content grid display
  /search-modal     - Search interface
  /live-tv-modal    - Live TV section
  /printer-animation - Registration status animation
  /ad-blocker       - Ad blocking system
  /referral-section - Referral link component

/lib
  /supabase         - Supabase client setup
  /utils            - Utility functions
  /auth             - Authentication utilities
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `ADMIN_SECRET` | Secret key for admin panel access |
| `NODE_ENV` | Environment (development/production) |

## Database Schema

The app uses a `users` table with:
- `id`: UUID primary key
- `username`: Unique username
- `phcorner_user`: Associated phcorner account
- `password_hash`: Bcrypt hashed password
- `ip_address`: User IP for anti-hit-and-run
- `status`: pending/approved/rejected
- `created_at`: Registration timestamp
- `updated_at`: Last update timestamp

## Security Features

- **Password Hashing**: All passwords hashed with bcrypt
- **IP Tracking**: Prevents hit-and-run registrations
- **Session Management**: Secure HTTP-only cookies
- **Ad Blocking**: Prevents malicious ad networks
- **Admin Authentication**: Secret-based admin panel access
- **Row Level Security**: Supabase RLS policies

## License

MIT

## Support

For issues or support, visit [Vercel Help](https://vercel.com/help)
