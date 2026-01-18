# mflow - Smart Retail POS & Inventory Management (Frontend)

A modern, responsive React-based frontend for the mflow retail management system. Built with Vite, React Router, and Zustand for state management.

## 🚀 Features

- **Multi-tenant Architecture** - Support for multiple businesses with role-based access control
- **Real-time POS** - Fast and intuitive point-of-sale interface
- **Inventory Management** - Track stock across multiple shops/branches
- **Sales Analytics** - Comprehensive reporting and analytics dashboards
- **User Management** - Role-based permissions (Business Owner, Manager, Shop Manager, Sales Rep)
- **Supplier Management** - Purchase orders and supplier tracking
- **Expense Tracking** - Monitor business expenses and categories
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Backend API** running (see backend README)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tritva.mpos-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🧪 Testing

```bash
npm run lint        # Run ESLint
npm run preview     # Preview production build locally
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   └── ui/             # Base UI components (Button, Input, Table, etc.)
├── pages/              # Page components
│   ├── auth/           # Authentication pages (Login, Register, Onboarding)
│   ├── dashboard/      # Dashboard pages
│   ├── sales/          # Sales and POS pages
│   ├── stocks/         # Inventory management
│   ├── products/       # Product catalog
│   ├── suppliers/      # Supplier management
│   ├── users/          # User management
│   ├── expenses/       # Expense tracking
│   ├── reports/        # Analytics and reports
│   └── super-admin/    # Super admin pages
├── router/             # React Router configuration
├── services/           # API service layer
├── store/              # Zustand state management
└── utils/              # Utility functions

```

## 🔑 Key Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charts and data visualization
- **Axios** - HTTP client

## 🎯 User Roles & Permissions

### Super Admin
- Manage all businesses and subscriptions
- View system-wide analytics
- Manage users across all businesses

### Business Owner
- Full access to their business
- Manage shops/branches
- View all reports and analytics
- Manage users and permissions

### Business Manager
- Similar to Business Owner
- Cannot delete business

### Shop Manager
- Manage assigned shop
- Process sales and returns
- View shop-specific reports

### Sales Representative
- Process sales
- View assigned shop inventory
- Limited reporting access

## 🔐 Authentication Flow

1. **Registration** → Email verification → **Onboarding**
2. **Onboarding** (2 steps):
   - Step 1: Business Details (name, type, address)
   - Step 2: Shops/Branches Setup (count + names)
3. **Dashboard** → Full application access

## 🌐 API Integration

All API calls are handled through service files in `src/services/`:

- `authService.js` - Authentication
- `businessService.js` - Business management
- `shopService.js` - Shop/branch management
- `productService.js` - Product catalog
- `saleService.js` - Sales transactions
- `stockService.js` - Inventory management
- `supplierService.js` - Supplier management
- `userService.js` - User management
- `expenseService.js` - Expense tracking
- `reportService.js` - Analytics and reports

## 🎨 Styling Guidelines

- Uses Tailwind CSS utility classes
- Custom components in `src/components/ui/`
- Responsive design with mobile-first approach
- Consistent color scheme and spacing

## 🚧 Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **State Management**: Use Zustand for global state, local state for component-specific data
3. **API Calls**: Always use service layer, never call API directly from components
4. **Error Handling**: Use try-catch blocks and display user-friendly error messages
5. **Permissions**: Check permissions before rendering sensitive UI elements
6. **Routing**: Use `ProtectedRoute` and `PermissionRoute` wrappers

## 📝 Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API connection issues
- Verify backend is running on correct port
- Check VITE_API_URL in .env file
- Ensure CORS is configured on backend

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For support, contact: bonnienjuguna106@gmail.com
