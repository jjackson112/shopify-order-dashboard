import { useEffect, useState } from "react";
import { AppProvider } from '@shopify/polaris'
import { Route, Routes, Navigate } from "react-router-dom";

import AuthLayout from "./components/AuthLayout";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from "./hooks/useAuth";

import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import OrderList from './pages/OrderList';
import ProductDetail from './components/ProductDetail';
import OrderDetail from './components/OrderDetail';
import CustomerList from './pages/CustomerList';

// console.log("ORDERLIST IMPORT TEST", OrderList)

function App() {
  const [authMessage, setAuthMessage] = useState("")

  // listen for auth:expired + contains state/message for auth updates
  useEffect(() => {
    const handleExpiredToken = () => {
      setAuthMessage("Session has expired. Please log in again.")
    }

    window.addEventListener("auth:expired", handleExpiredToken)

    return () => {
      window.removeEventListener("auth:expired", handleExpiredToken)
    }
  }, [])

  return (
    <AppProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />}>
            <Route path="/login" element={<LoginForm authMessage={authMessage} setAuthMessage={setAuthMessage} />} />
          </Route>
            <Route path="/register" element={<RegisterForm />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>}
          />

          <Route 
            path="/products" 
            element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>}
            />

          <Route 
            path="/products/detail" 
            element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>}
          />

          <Route
            path="/orders"
            element={
            <ProtectedRoute>
              <OrderList />
            </ProtectedRoute>}
          />

          <Route
            path="/orders/detail"
            element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>}
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AppProvider>
  )
}

export default App;
