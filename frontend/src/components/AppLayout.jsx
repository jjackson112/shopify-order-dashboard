import "../App.css";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

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

export default AppLayout;