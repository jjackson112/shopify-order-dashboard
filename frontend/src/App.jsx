import { AppProvider } from '@shopify/polaris'
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import Dashboard from "./pages/Test";
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

      </Routes>
      <Test />
      </AppProvider>
  )
}

export default App;
