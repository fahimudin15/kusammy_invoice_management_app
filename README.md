# Kusammy Store Invoice Manager 🧴

A beautiful, modern invoice management application designed for Gandour cosmetics resellers. Built with Next.js, Supabase, and featuring a vibrant orange design system.

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)

## ✨ Features

### 📊 Dashboard
- **Beautiful Stats Cards**: Today's sales, total invoices, revenue tracking, and average invoice value
- **Recent Invoices**: Quick view of your latest sales with customer names and amounts
- **Personalized Greeting**: Warm welcome message with user's name

### 🧾 Invoice Management
- **Create Invoices**: Easy-to-use form with 21 Gandour products pre-loaded
- **Product Categories**: Body Lotions, Soaps, Creams, and Serums
- **PDF Export**: Download invoices as professional PDF documents
- **Print Support**: Print-optimized invoice layouts

### 👥 Customer Management
- **Clients Page**: View all unique customers in a beautiful card layout
- **Customer Tracking**: Automatically extracted from invoices

### 🔐 Authentication
- **Supabase Auth**: Secure email/password authentication
- **Protected Routes**: Middleware-based route protection
- **User Isolation**: Each user sees only their own data

### 🎨 Design System
- **Gandour Orange Theme**: Vibrant `#FF6A00` primary color
- **Modern UI**: Inter font, rounded corners, smooth animations
- **Mobile-First**: Bottom navigation bar and responsive layouts
- **African-Inspired**: Subtle fabric pattern background

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd kusammy_invoice_management_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Get your credentials from **Settings → API**:
      - Project URL
      - anon/public key
   
   c. Create `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Create database tables**
   
   a. Go to **SQL Editor** in your Supabase dashboard
   
   b. Run the SQL from `lib/supabase/schema.sql`
   
   This creates the `invoices` table with Row Level Security

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kusammy_invoice_management_app/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   ├── signup/              # Signup page
│   │   └── callback/            # OAuth callback handler
│   ├── clients/                 # Clients list page
│   ├── invoices/                # Invoice pages
│   │   ├── create/              # Create invoice form
│   │   ├── [id]/                # View invoice details
│   │   └── page.tsx             # All invoices list
│   ├── settings/                # Settings page
│   ├── globals.css              # Global styles & design system
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Dashboard (home page)
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   ├── bottom-nav.tsx           # Mobile bottom navigation
│   ├── empty-state.tsx          # Empty state component
│   ├── loading-spinner.tsx      # Loading indicator
│   ├── navigation.tsx           # Top navigation bar
│   ├── product-card.tsx         # Product display card
│   └── stat-card.tsx            # Dashboard stat card
├── contexts/                     # React contexts
│   └── auth-context.tsx         # Authentication context
├── lib/                         # Utility libraries
│   ├── supabase/                # Supabase configuration
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   └── schema.sql           # Database schema
│   ├── invoice-service.ts       # Invoice CRUD operations
│   └── utils.ts                 # Helper functions
├── middleware.ts                # Route protection middleware
├── .env.local                   # Environment variables (create this)
├── .env.example                 # Environment template
└── package.json                 # Dependencies
```

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Orange | `#FF6A00` | Buttons, accents, highlights |
| Primary Hover | `#E65F00` | Button hover states |
| Success Green | `#22C55E` | Success messages, positive trends |
| Background | `#FAFAFA` | Page background |
| Card | `#FFFFFF` | Card backgrounds |
| Secondary | `#FFFCF5` | Soft cream accents |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 3xl-5xl sizes
- **Body**: Regular, 400-600 weights

### Components

- **Rounded Corners**: 0.75rem base radius
- **Shadows**: Layered with orange/green glows
- **Animations**: Smooth 300ms transitions
- **Hover Effects**: Scale and shadow changes

## 📦 Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own invoices
- **Protected Routes**: Middleware validates sessions on every request
- **Secure Cookies**: HTTP-only cookies for session tokens
- **Environment Variables**: Sensitive keys stored in `.env.local` (gitignored)

## 📱 Mobile Experience

- **Bottom Navigation**: Fixed navigation bar on mobile devices
- **Floating Action Button**: Quick access to create invoices (desktop)
- **Responsive Grid**: Adapts from 1-4 columns based on screen size
- **Touch-Optimized**: Large tap targets (min 44px)

## 🛠️ Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📊 Database Schema

### Invoices Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| invoice_number | TEXT | Unique invoice identifier |
| customer_name | TEXT | Customer name |
| customer_phone | TEXT | Customer phone (optional) |
| customer_address | TEXT | Customer address (optional) |
| notes | TEXT | Invoice notes (optional) |
| items | JSONB | Array of invoice items |
| subtotal | DECIMAL | Subtotal amount |
| tax | DECIMAL | Tax percentage |
| tax_amount | DECIMAL | Calculated tax amount |
| total_amount | DECIMAL | Final total |
| company_info | JSONB | Company details |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 🎯 Product Categories

### Body Lotions / Fade Milks (5 products)
- Bio Claire Lightening Body Lotion
- Carotone Brightening Body Lotion
- Diva Maxima Radiance Milk
- Bio Claire Intense Fade Milk
- Carotone Black Spot Corrector Lotion

### Soaps / Beauty Bars (9 products)
- Bio Claire Exfoliating Soap
- Carotone Brightening Soap
- Diva Maxima Glow Soap
- Bio Claire Black Soap
- Carotone Papaya Soap
- And 4 more...

### Tubs / Jars / Cream Pots (3 products)
- Bio Claire Fade Cream Jar
- Carotone Brightening Cream Pot
- Diva Maxima Glow Cream Tub

### Serums & Oils (4 products)
- Bio Claire Vitamin C Serum
- Carotone Glow Booster Serum
- Diva Maxima Radiance Oil
- Bio Claire Argan Oil Elixir

## 🐛 Troubleshooting

### "Error loading invoices"
- Ensure Supabase credentials are correct in `.env.local`
- Verify the `invoices` table exists in your Supabase database
- Check that RLS policies are enabled

### "Cannot find module '@/components/...'"
- Run `npm install` to ensure all dependencies are installed
- Restart the development server

### PDF export not working
- Ensure `jspdf` and `html2canvas` are installed
- Check browser console for errors

## 📝 License

This project is private and proprietary.

## 👨‍💻 Author

Created for Kusammy Store - Gandour Cosmetics Reseller

## 🙏 Acknowledgments

- Gandour for the amazing cosmetics products
- Supabase for the backend infrastructure
- shadcn/ui for the beautiful component library
- Next.js team for the excellent framework

---

**Need help?** Check the `supabase_setup_guide.md` in the artifacts directory for detailed setup instructions.
