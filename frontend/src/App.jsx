import { AppProvider } from '@shopify/polaris'
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthLayout from "./components/AuthLayout";
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetail from './components/ProductDetail';

function ProtectedRoute({ children }) {
  const { userLoggedIn } = useContext(AuthContext);

  if (!userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginForm />} />
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
      </Routes>
      </AppProvider>
  )
}

export default App;
