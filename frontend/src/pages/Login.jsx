import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, FormLayout, TextField, Button } from "@shopify/polaris";

// autocomplete (boolean) gives the browser the ability to autocomplete input elements

function LoginForm() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Logging in")

        try {
            const data = await api.post("/auth/login", {
                identifier,
                password,
            })

            localStorage.setItem("token", data.token)
            console.log(data)

            login(data.token, data.username)
            navigate("/dashboard")

        } catch (err) {
            console.error(err)
        }
    }

    return (
      <Form onSubmit={handleSubmit}>
       <h1>Login Page</h1>

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

       <Button submit variant="primary">Login</Button>
      </Form>
    );
}

export default LoginForm;