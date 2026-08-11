import "../App.css";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

function AuthLayout({ children }) {
    return (
        <div className="auth-shell">
            <Header />

            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default AuthLayout;