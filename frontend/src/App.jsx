import { AppProvider } from '@shopify/polaris'
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import OrderList from './pages/OrderList';
import ProductDetail from './components/ProductDetail';
import OrderDetail from './components/OrderDetail';

// console.log("ORDERLIST IMPORT TEST", OrderList)

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        {/* Protected Routes */}
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
            path="/products/:id" 
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
            path="/orders/:id"
            element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>}
          />
      </Routes>
      </AppProvider>
  )
}

export default App;
