import "../App.css";
import { Header } from "../components/Header";

function AppLayout() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <Outlet />
      </main>    
      
    </div>
  )
}