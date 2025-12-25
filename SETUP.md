# mPOS Frontend Setup Guide

## ✅ Installed Packages

### Core Dependencies

- **React Router DOM** - Client-side routing
- **Zustand** - Lightweight state management with persistence
- **TanStack Query (React Query)** - Server state management and data fetching
- **Zod** - Schema validation
- **Formik** - Form handling and validation
- **Tailwind CSS v4** - Utility-first CSS framework

### Dev Dependencies

- **@tanstack/react-query-devtools** - React Query debugging tools

## 📁 Project Structure

```
src/
├── components/
│   └── ProtectedRoute.jsx       # Route authentication wrapper
├── hooks/
│   └── useAuth.js                # Custom auth hook with React Query
├── lib/
│   ├── api.js                    # Fetch API wrapper with auth
│   └── queryClient.js            # React Query configuration
├── pages/
│   ├── Home.jsx                  # Landing page (public)
│   ├── Login.jsx                 # Login page
│   ├── Register.jsx              # Registration page
│   └── Dashboard.jsx             # Protected dashboard
├── router/
│   └── index.jsx                 # React Router configuration
├── schemas/
│   └── authSchemas.js            # Zod validation schemas
├── services/
│   └── authService.js            # Auth API calls
└── store/
    └── authStore.js              # Zustand auth store
```

## 🔧 Configuration

### Environment Variables

The `.env` file is configured with:

```
VITE_API_BASE_URL=https://unify-pos-api-production.up.railway.app/api
```

### API Integration

The app is configured to work with your backend API:

- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`

### Registration Fields

The registration form includes all required fields:

- Email
- Password
- Phone Number
- Business Name
- Business Type (dropdown: Retail, Restaurant, Cafe, Grocery, Pharmacy, Other)

## 🚀 Available Pages

1. **Home** (`/`) - Landing page with features showcase
2. **Login** (`/login`) - User authentication
3. **Register** (`/register`) - New user registration
4. **Dashboard** (`/dashboard`) - Protected route for authenticated users

## 🎨 Features

### Authentication

- ✅ Login with email/password
- ✅ Registration with business details
- ✅ Protected routes
- ✅ Persistent auth state (localStorage)
- ✅ Automatic token handling
- ✅ Auto-logout on 401 responses

### Form Validation

- ✅ Zod schema validation
- ✅ Formik form handling
- ✅ Real-time error messages
- ✅ Field-level validation

### State Management

- ✅ Zustand for auth state
- ✅ React Query for server state
- ✅ Automatic cache management
- ✅ Optimistic updates support

### Styling

- ✅ Tailwind CSS v4
- ✅ Responsive design
- ✅ Modern gradient backgrounds
- ✅ Smooth transitions and hover effects

## 🏃 Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 Usage Examples

### Using the Auth Hook

```javascript
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { user, login, logout, isLoggingIn } = useAuth();

  const handleLogin = async () => {
    await login({ email: "user@example.com", password: "password" });
  };

  return (
    <div>
      {user ? (
        <button onClick={() => logout()}>Logout</button>
      ) : (
        <button onClick={handleLogin} disabled={isLoggingIn}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Making API Calls

```javascript
import { api } from "../lib/api";

// GET request
const data = await api.get("/products");

// POST request
const newProduct = await api.post("/products", {
  name: "Product Name",
  price: 99.99,
});

// PUT request
const updated = await api.put("/products/1", { name: "Updated Name" });

// DELETE request
await api.delete("/products/1");
```

### Creating Protected Routes

```javascript
import ProtectedRoute from '../components/ProtectedRoute';

// Basic protection
<ProtectedRoute>
  <MyProtectedPage />
</ProtectedRoute>

// Role-based protection
<ProtectedRoute requiredRole="ADMIN">
  <AdminPage />
</ProtectedRoute>
```

## 🎯 Next Steps

1. Customize the Home page with your branding
2. Add more pages as needed
3. Implement additional API endpoints in services
4. Add more validation schemas
5. Customize Tailwind theme if needed
6. Add error boundaries
7. Implement toast notifications

## 📚 Documentation Links

- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/)
- [Formik](https://formik.org/)
- [Tailwind CSS](https://tailwindcss.com/)
