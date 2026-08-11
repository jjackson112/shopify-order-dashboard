import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Text, Button } from "@shopify/polaris";

function Header() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const username = localStorage.getItem("username") || "merchant"

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div className="header-container">
            <Text as="p">{`Welcome, ${username}`}</Text>
            <Button
                variant="plain"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>

    )
}

export default Header;