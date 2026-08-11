import { AppProvider } from '@shopify/polaris'
import { Route, Routes } from "react-router-dom";

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
  const { userLoggedIn } = useAuth()

  useEffect(() => {
    const handleExpiredToken = () => {
      setAuthMessage("Session has expired. Please log in again.")
    }

    window.addEventListener("auth:expired", handleExpiredToken)

    return () => {
      window.removeEventListener("auth:expired", handleExpiredToken)
    }
  }, [])

  useEffect(() => {
    if (userLoggedIn) {
      setAuthMessage("")
    } 
  }, [userLoggedIn])

  return (
    <AppProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
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
