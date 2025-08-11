# TMS Frontend

Next.js frontend application for the Ticket Management System (TMS).

## Features

- **Modern UI/UX**: Built with Next.js 14 and Tailwind CSS
- **Authentication**: Complete login, registration, and password reset flow
- **Real-time Notifications**: WebSocket integration for live updates
- **Ticket Management**: View, search, and manage tickets
- **AI Chat Support**: Integrated chat interface with Grok AI
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Built-in dark/light theme support

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Context** - State management
- **WebSocket** - Real-time communication
- **JWT** - Authentication

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BertinAm/tms-frontend.git
   cd tms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true

# WebSocket
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin pages
│   ├── (auth)/            # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── header/           # Header components
│   └── layout/           # Layout components
├── context/              # React contexts
├── hooks/                # Custom hooks
├── icons/                # Icon components
└── types/                # TypeScript types
```

## Pages

### Authentication
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request
- `/verify-otp` - OTP verification
- `/reset-password` - Password reset

### Admin Dashboard
- `/` - Main dashboard
- `/tickets` - All tickets
- `/tickets/open` - Open tickets
- `/tickets/high-priority` - High priority tickets
- `/tickets/[id]` - Individual ticket view
- `/chat` - AI chat support
- `/analytics` - Analytics dashboard
- `/notifications` - Notifications center
- `/profile` - User profile

## Development

### Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_WS_URL=wss://your-backend-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
