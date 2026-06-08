import './App.css'
import { AppProvider } from '@shopify/polaris'
import Dashboard from "./pages/Test"

function App() {
  return (
    <AppProvider>
      <Dashboard />
      </AppProvider>
  )
}

export default App;
