import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Text, Button, Icon } from "@shopify/polaris";
import { StoreIcon } from "@shopify/polaris-icons";

function Header() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const username = localStorage.getItem("username") || "merchant"

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-brand">
                    <Link to="/dashboard" aria-label="Go to dashboard"><Icon source={StoreIcon} /></Link>
                    <Text as="p">{`Welcome, ${username} 👋`}</Text>
                </div>
                <Button
                    variant="secondary"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </header>
    )
}

export default Header;