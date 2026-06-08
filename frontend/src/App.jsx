import { AppProvider } from '@shopify/polaris'
import Dashboard from "./pages/Test"

function App() {
  return (
    <AppProvider>
      <Test />
      </AppProvider>
  )
}

export default App;
