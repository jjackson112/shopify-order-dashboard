import { AppProvider } from '@shopify/polaris'
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';

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
        <Route>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      </AppProvider>
  )
}

export default App;
