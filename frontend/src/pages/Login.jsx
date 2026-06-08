import { useState } from "react";
import { Form, FormLayout, TextField, Button } from "@shopify/polaris";

// autocomplete (boolean) gives the browser the ability to autocomplete input elements

function LoginForm() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Logging in")

        try {
            const data = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify({
                    identifier,
                    password,
                }),
            })

            console.data(data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
      <Form>
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