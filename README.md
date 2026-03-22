# 📚 LakshyaLibrary - Production-Ready SaaS Library Management System

A comprehensive, scalable, and secure library management system built with the MERN stack.

## 🚀 Features

### Core Features
- ✅ **Advanced Authentication System** - JWT with access/refresh tokens, OTP verification
- ✅ **Role-Based Access Control** - Admin and Student roles with protected routes
- ✅ **Advanced Seat Management** - Visual seat grid with real-time updates
- ✅ **Advanced Fee Management** - Auto-calculation, late fees, discounts
- ✅ **Online Payment Integration** - Razorpay payment gateway
- ✅ **PDF Generation** - Professional receipts and ID cards
- ✅ **Email Notifications** - Automated emails for credentials, payments, etc.
- ✅ **Real-time Analytics** - Live dashboard with charts and statistics
- ✅ **Admission System** - Public admission form with admin approval workflow

### Admin Features
- Student management (CRUD operations)
- Seat assignment and management
- Fee structure configuration
- Payment recording (online/offline)
- Discount management
- Analytics dashboard with charts
- Admission request handling
- Activity logs and audit trails

### Student Features
- Personal dashboard
- Fee payment (online via Razorpay)
- Payment history and receipt downloads
- ID card generation
- Seat information
- Notification center
- Profile management

## 🛠️ Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time updates
- Razorpay for payments
- Nodemailer for emails
- PDFKit for PDF generation
- Node-cron for scheduled tasks
- Swagger for API documentation
- Jest for testing

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Query for data fetching
- React Hook Form with Zod validation
- Recharts for analytics
- jsPDF for PDF generation
- Socket.io client for real-time features
- PWA support

## 📁 Project Structure

```
LakshyaLibrary/
├── backend/             # Backend application
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic layer
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── cron/            # Scheduled tasks
│   ├── sockets/         # Socket.io handlers
│   ├── docs/            # API documentation
│   ├── tests/           # Test files
│   └── server.js        # Entry point
│
└── frontend/            # Frontend application
    ├── src/
    │   ├── components/  # React components
    │   ├── layouts/     # Layout components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom hooks
    │   ├── services/    # API services
    │   ├── store/       # State management
    │   ├── context/     # React context
    │   ├── utils/       # Utility functions
    │   └── assets/      # Static assets
    └── public/          # Public files
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd LakshyaLibrary/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env` file and update with your credentials
- Set MongoDB URI
- Configure email SMTP settings
- Add Razorpay API keys
- Set JWT secrets

4. Seed admin user:
```bash
npm run seed:admin
```

5. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd LakshyaLibrary/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Update `.env` with API URL and Razorpay key

4. Start development server:
```bash
npm run dev
```

## 🔐 Default Admin Credentials

```
Email: admin@lakshyalibrary.com
Password: Admin@123456
```

**⚠️ Change these credentials in production!**

## 📚 API Documentation

Once the server is running, access Swagger documentation at:
```
http://localhost:5000/api-docs
```

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

## 🚀 Deployment

### Backend Deployment
- Deploy to services like Railway, Render, or AWS
- Set environment variables in production
- Use MongoDB Atlas for database
- Configure email service (SendGrid, AWS SES)

### Frontend Deployment
- Deploy to Vercel, Netlify, or Cloudflare Pages
- Update API URLs in environment variables
- Build for production: `npm run build`

## 📄 License

MIT License

## 👨‍💻 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for modern library management
