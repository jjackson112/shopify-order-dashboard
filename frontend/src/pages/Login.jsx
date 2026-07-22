import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, FormLayout, TextField, Button, Text } from "@shopify/polaris";

// autocomplete (boolean) gives the browser the ability to autocomplete input elements

function LoginForm() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Logging in")

        try {
            setLoading(true)
            setError("")

            const data = await api.post("/auth/login", {
                identifier,
                password,
            })

            console.log(data)

            localStorage.setItem("token", data.token)
            console.log("TOKEN AFTER SET:", localStorage.getItem("token"))

            login(data.token, data.username)
            navigate("/dashboard")

        } catch (err) {
            console.error(err)
            setError(err.message || "Login failed. Invalid username or password")
        } finally {
            setLoading(false)
        }
    }

    return (
      <Form onSubmit={handleSubmit}>
       <h1>Login</h1>

        <TextField 
           label="Username/Email" 
           value={identifier}
           onChange={setIdentifier}
           autoComplete="username"
       />

        <TextField 
           label="Password" 
           type="password" 
           value={password}
           onChange={setPassword}
           autoComplete="password"
       />

        {error && (
          <Text as="p" tone="critical">{error}</Text>
        )}

       <Button submit variant="primary" loading={loading}>Login</Button>
       <Button onClick={(() => navigate("/register"))} disabled={loading}>Register</Button>
      </Form>
    );
}

export default LoginForm;