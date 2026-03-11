# Gharpayy Lead Management System

A modern, full-stack SaaS CRM for real estate lead management with a dark theme and intuitive interface.

## Features

- 🎯 **Lead Management**: Capture, track, and manage leads from multiple sources
- 📊 **Dashboard Analytics**: Real-time insights with charts and metrics
- 🔄 **Pipeline Management**: Drag-and-drop Kanban board for lead stages
- 📅 **Visit Scheduling**: Schedule and track property visits
- 👥 **Agent Performance**: Track agent productivity and conversion rates
- 🔔 **Follow-up Reminders**: Automated follow-up system
- 🌙 **Dark Theme**: Modern dark mode UI inspired by Linear, Supabase, and Vercel

## Tech Stack

### Frontend
- Next.js 14 with TypeScript
- TailwindCSS for styling
- Shadcn UI components
- React Query for data fetching
- dnd-kit for drag-and-drop functionality
- Recharts for data visualization
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- JWT authentication
- PostgreSQL database
- Zod for validation

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gharpayy-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   **Backend** (copy `backend/.env.example` to `backend/.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/gharpayy_crm"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Frontend** (copy `frontend/.env.local.example` to `frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start both frontend (http://localhost:3000) and backend (http://localhost:3001) servers.

## Project Structure

```
gharpayy-crm/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable React components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   ├── leads/          # Lead management components
│   │   ├── pipeline/       # Pipeline/Kanban components
│   │   └── visits/         # Visit scheduling components
│   ├── contexts/           # React contexts
│   ├── providers/          # Query and other providers
│   └── ...
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic services
│   │   ├── middleware/     # Express middleware
│   │   └── ...
│   ├── prisma/             # Database schema and migrations
│   └── ...
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Leads
- `GET /api/leads` - Get all leads with filtering
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get lead details
- `PATCH /api/leads/:id/status` - Update lead status
- `POST /api/leads/:id/activities` - Add lead activity

### Visits
- `GET /api/visits` - Get all visits
- `POST /api/visits` - Schedule new visit
- `PATCH /api/visits/:id` - Update visit outcome

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/leaderboard` - Get agent performance leaderboard

## Lead Sources

The system supports multiple lead sources:
- Website Form
- WhatsApp
- Tally Form
- Google Form
- Phone Inquiry
- Social Media
- Referral
- Other

## Pipeline Stages

Leads move through these stages in the pipeline:
1. New Lead
2. Contacted
3. Requirement Collected
4. Property Suggested
5. Visit Scheduled
6. Visit Completed
7. Booked
8. Lost

## Visit Outcomes

Track visit outcomes:
- Visited
- No Show
- Booked
- Not Interested
- Rescheduled

## Database Schema

The application uses PostgreSQL with the following main models:
- **User**: Agents and admin users
- **Lead**: Customer leads with details and status
- **Visit**: Scheduled property visits
- **LeadActivity**: Timeline of lead interactions
- **Property**: Property details

## Development

### Running individually
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Database operations
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# View database
npx prisma studio
```

### Building for production
```bash
npm run build
npm start
```

## Features in Detail

### 🎯 Lead Capture API
Easily capture leads from external sources:
```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "phone": "9876543210",
    "source": "Website"
  }'
```

### 🔄 Automated Lead Assignment
Leads are automatically assigned to agents using round-robin distribution.

### 🔔 Follow-up System
Automated reminders trigger when leads have no activity for 24 hours.

### 📊 Real-time Analytics
- Total leads and conversion rates
- Lead source distribution
- Agent performance metrics
- Daily lead trends

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
