# 🏨 Luxury Hotel Booking Platform

A world-class, industrial-level hotel booking application built with Vue.js 3, featuring exceptional UI/UX design, advanced search capabilities, and luxury-focused user experience.

## ✨ Features

### 🎨 **Luxury Design System**
- **Modern Glassmorphism UI** - Sophisticated glass effects and blur backgrounds
- **Advanced Color Palette** - Luxury gold accents with professional blue gradients
- **Fluid Typography** - Responsive text scaling with premium fonts
- **Micro-interactions** - Smooth animations and hover effects
- **Dark Mode Support** - Automatic theme switching based on user preference

### 🔍 **Advanced Search Experience**
- **Smart Date Picker** - Intuitive calendar interface with validation
- **Real-time Filters** - Dynamic room filtering with instant results
- **Advanced Options** - Collapsible advanced search with amenities
- **Price Range Slider** - Visual price selection with range indicators
- **Room Type Categories** - Luxury-focused room classifications

### 📱 **Progressive Web App (PWA)**
- **Offline Support** - Cached content for offline browsing
- **App-like Experience** - Installable on mobile devices
- **Push Notifications** - Real-time booking updates
- **Background Sync** - Automatic data synchronization

### 🚀 **Performance Optimizations**
- **Lazy Loading** - Images and components load on demand
- **Code Splitting** - Optimized bundle sizes
- **Image Optimization** - WebP format with responsive sizing
- **Caching Strategy** - Intelligent API and asset caching

### 🎯 **User Experience**
- **Responsive Design** - Perfect on all devices and screen sizes
- **Accessibility** - WCAG 2.1 compliant with screen reader support
- **Loading States** - Elegant loading animations and skeletons
- **Error Handling** - User-friendly error messages and recovery

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - Intuitive state management
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Sass** - CSS preprocessor for advanced styling

### UI/UX Libraries
- **Headless UI** - Unstyled, accessible UI components
- **Heroicons** - Beautiful hand-crafted SVG icons
- **Framer Motion** - Production-ready motion library
- **GSAP** - Professional-grade animation library
- **Swiper** - Modern mobile touch slider

### Development Tools
- **TypeScript** - Type-safe JavaScript development
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatter
- **Vue DevTools** - Development debugging tools

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/luxury-hotel-booking.git
   cd luxury-hotel-booking
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   cd frontend
   npm install
   
   # Backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Frontend environment
   cd frontend
   cp .env.example .env.local
   
   # Backend environment
   cd ../backend
   cp .env.example .env
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 🏗️ Project Structure

```
luxury-hotel-booking/
├── frontend/                 # Vue.js 3 frontend application
│   ├── src/
│   │   ├── components/       # Reusable Vue components
│   │   │   └── ui/          # Base UI components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia state management
│   │   ├── services/        # API services
│   │   ├── router/          # Vue Router configuration
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   └── dist/                # Production build
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── config/          # Configuration files
│   │   └── database/        # Database files
│   └── package.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0ea5e9` - Main brand color
- **Luxury Gold**: `#f59e0b` - Premium accent color
- **Success Green**: `#10b981` - Positive actions
- **Warning Orange**: `#f59e0b` - Caution states
- **Error Red**: `#ef4444` - Error states

### Typography
- **Primary Font**: Inter - Modern, readable sans-serif
- **Display Font**: Playfair Display - Elegant serif for headings
- **Monospace**: JetBrains Mono - Code and technical content

### Spacing System
- **Base Unit**: 4px (0.25rem)
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

### Shadows
- **Subtle**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Medium**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **Large**: `0 10px 15px rgba(0, 0, 0, 0.1)`
- **Extra Large**: `0 20px 25px rgba(0, 0, 0, 0.1)`

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend Deployment (Railway)
```bash
cd backend
railway login
railway up
```

### Environment Variables

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Luxury Hotel Booking
VITE_APP_VERSION=2.0.0
```

#### Backend (.env)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
DATABASE_URL=sqlite:./database/hotel.db
```

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code
npm run type-check   # TypeScript type checking
```

### Backend
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run seed         # Seed database
npm run test         # Run tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Unsplash** - For beautiful hotel images
- **Heroicons** - For the beautiful icon set

## 📞 Support

For support, email support@luxuryhotelbooking.com or join our Slack channel.

---

**Built with ❤️ for luxury travel experiences**
