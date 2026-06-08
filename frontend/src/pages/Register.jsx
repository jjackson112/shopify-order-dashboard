import { useState } from "react";
import { Form, FormLayout, TextField, Button } from "@shopify/polaris";

// autocomplete (boolean) gives the browser the ability to autocomplete input elements

function RegisterForm() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

 return (
   <Form>
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