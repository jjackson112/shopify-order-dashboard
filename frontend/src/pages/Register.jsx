import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Form, FormLayout, TextField, Button } from "@shopify/polaris";

// autocomplete (boolean) gives the browser the ability to autocomplete input elements
// Register → receive tokens → authenticated → dashboard

function RegisterForm() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // no const data = response.data - already parsed data
        try {
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
            console.log(error)
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

       <Button submit variant="primary">Register</Button>
      </Form>
    );
}

export default RegisterForm;