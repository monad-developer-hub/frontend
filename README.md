# 🌐 Monad Developer Hub Frontend

A modern, responsive web application for the Monad Developer Hub built with Next.js, React, and TypeScript. Features real-time blockchain analytics, project management, and a comprehensive developer dashboard.

## 🌟 Features

### 📊 **Analytics Dashboard**
- Real-time blockchain statistics and metrics
- Interactive charts and visualizations using Recharts
- Transaction explorer with advanced filtering
- Contract usage analytics and insights

### 🏗️ **Project Management**
- Community project showcase
- Project submission system with file uploads
- Project discovery and filtering
- Admin panel for project review and management

### 🔍 **Blockchain Explorer**
- Transaction search and details
- Block explorer with comprehensive data
- Wallet activity tracking
- MON token transfer monitoring

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/light theme support with next-themes
- Component library built with Radix UI primitives
- Tailwind CSS for styling with animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Monad DevHub Backend running
- Monad Ponder Indexer running

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd monad-devhub-fe
   npm install
   # or
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_INDEXER_API_URL=http://localhost:42069
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080

# Analytics Configuration
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_REFRESH_INTERVAL=30000

# Features
NEXT_PUBLIC_ENABLE_PROJECT_SUBMISSION=true
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=true

# External Services (optional)
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

### API Integration

The frontend connects to multiple backend services:

```typescript
// API endpoints configuration
const API_CONFIG = {
  backend: process.env.NEXT_PUBLIC_API_BASE_URL,      // Go backend
  indexer: process.env.NEXT_PUBLIC_INDEXER_API_URL,   // Ponder indexer
  websocket: process.env.NEXT_PUBLIC_WEBSOCKET_URL,   // WebSocket server
};
```

## 📁 Project Structure

```
monad-devhub-fe/
├── app/                    # Next.js 13+ App Router
│   ├── admin/             # Admin panel pages
│   ├── analyze/           # Analytics dashboard
│   ├── projects/          # Project management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   ├── charts/           # Chart components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── contexts/             # React contexts
│   ├── theme-context.tsx
│   └── data-context.tsx
├── hooks/                # Custom React hooks
│   ├── useApi.ts
│   ├── useWebSocket.ts
│   └── useAnalytics.ts
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   ├── utils.ts         # Helper functions
│   └── validations.ts   # Form validations
├── public/               # Static assets
├── styles/               # Additional styles
└── types/                # TypeScript definitions
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Custom hooks
- **Theme**: next-themes for dark/light mode

### Key Dependencies

```json
{
  "next": "15.2.4",
  "react": "^19",
  "typescript": "^5",
  "tailwindcss": "^3.4.17",
  "@radix-ui/react-*": "^1.1+",
  "recharts": "2.15.0",
  "react-hook-form": "^7.54.1",
  "zod": "^3.24.1"
}
```

## 🎨 UI Components

### Component Library

The app uses a custom component library built on Radix UI:

```tsx
// Example usage
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

export function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
        <Button>Refresh Data</Button>
      </CardContent>
    </Card>
  )
}
```

### Theme System

```tsx
// Theme provider setup
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
```

## 📊 Analytics Integration

### Real-time Data

```tsx
// WebSocket hook for real-time updates
import { useWebSocket } from "@/hooks/useWebSocket"

export function AnalyticsDashboard() {
  const { data, isConnected } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    events: ['block', 'transaction', 'networkStats']
  });

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      {data?.type === 'networkStats' && (
        <div>Current TPS: {data.data.tps}</div>
      )}
    </div>
  )
}
```

### API Integration

```tsx
// Custom API hook
import { useApi } from "@/hooks/useApi"

export function ProjectsList() {
  const { data: projects, loading, error } = useApi('/api/v1/projects');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

## 🔐 Authentication

The frontend handles authentication through the backend API:

```tsx
// Auth context
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: string) => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentials })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      // Redirect to admin panel
    }
  };

  return { user, login, loading };
}
```

## 📱 Responsive Design

The application is fully responsive with mobile-first design:

```css
/* Tailwind responsive classes */
.container {
  @apply px-4 sm:px-6 lg:px-8;
}

.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

.text-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}
```

## 🧪 Testing

### Unit Testing
```bash
# Add testing framework
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm run test
```

### E2E Testing
```bash
# Add Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment-specific Builds
```bash
# Staging
NEXT_PUBLIC_API_BASE_URL=https://staging-api.monaddevhub.com npm run build

# Production  
NEXT_PUBLIC_API_BASE_URL=https://api.monaddevhub.com npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-dashboard`)
3. Follow coding standards and add tests
4. Run linting: `npm run lint`
5. Submit Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write unit tests for components
- Document complex logic

### Component Guidelines
- Use Radix UI primitives when possible
- Follow Tailwind CSS conventions
- Implement proper accessibility (a11y)
- Support both light and dark themes

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Related Projects

- [Monad DevHub Backend](../monad-devhub-be/) - REST API backend
- [Monad Ponder Indexer](../monad-ponder-indexer/) - Blockchain indexer
- [Indexer Interface](../monad-devhub-indexer-interface/) - Data interface service

---

**Built with ❤️ for the Monad developer community** 🌐 