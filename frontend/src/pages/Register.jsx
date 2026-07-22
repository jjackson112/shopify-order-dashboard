import { useState } from "react";
import { api } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { Form, FormLayout, TextField, Button, Text } from "@shopify/polaris";

// autocomplete (boolean) gives the browser the ability to autocomplete input elements
// Register → receive tokens → authenticated → dashboard

function RegisterForm() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // no const data = response.data - already parsed data
        try {
            setLoading(true)
            setError("")

            const data = await api.post("/auth/register", {
                username,
                email,
                password,
            })
            
            console.log("Registered successfully", data)

            // clear form
            setUsername("");
            setEmail("");
            setPassword("")

            navigate("/dashboard")

        } catch (err) {
            console.error("Registeration failed", err)
            setError(err.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
      <Form onSubmit={handleSubmit}>
        <TextField 
           label="Username" 
           value={username}
           onChange={setUsername}
           autoComplete="username"
       />

        <TextField 
           label="email" 
           type="email" 
           value={email}
           onChange={setEmail}
           autoComplete="email"
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

       <Button submit variant="primary">Register</Button>

       <Text as="p">Already registered? <Link to="/login">Click here to login.</Link></Text>
      </Form>
    );
}

export default RegisterForm;