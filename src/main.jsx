import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import Home from './Pages/Home'
import About from './Pages/About'
import Products from './Pages/Products'
import ProductDetail from './Pages/ProductDetail'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import SignIn from './Pages/SignIn'

import AdminLayout from './Pages/Admin/AdminLayout'
import Overview from './Pages/Admin/Overview'
import UsersPage from './Pages/Admin/Users'
import ProductsPage from './Pages/Admin/Products'
import OrdersPage from './Pages/Admin/Orders'
import CategoriesPage from './Pages/Admin/Categories'
import TagsPage from './Pages/Admin/Tags'
import OrderHistory from './Pages/OrderHistory'

import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'

const router = createBrowserRouter([
  // Default entry point — redirect to store (publicly accessible)
  {
    path: '/',
    element: <Navigate to="/store" replace />,
  },

  // Sign-in (standalone, no layout)
  {
    path: '/signin',
    element: <SignIn />,
  },

  // Admin dashboard — protected, admin-only
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'tags', element: <TagsPage /> },
    ],
  },

  {
    path: '/store',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      
      // Protected customer actions
      { 
        path: 'cart', 
        element: <ProtectedRoute><Cart /></ProtectedRoute> 
      },
      { 
        path: 'checkout', 
        element: <ProtectedRoute><Checkout /></ProtectedRoute> 
      },
      { 
        path: 'orders', 
        element: <ProtectedRoute><OrderHistory /></ProtectedRoute> 
      },
    ],
  },
], {
  future: {
    v7_normalizeFormMethod: true,
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)