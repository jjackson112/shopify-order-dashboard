import { useState } from "react";
import { Form, FormLayout, TextField, Button } from "@shopify/polaris";

// autocomplete (boolean) gives the browser the ability to autocomplete input elements

function RegisterForm() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")

 return (
   <Form>
     <TextField 
        label="Username" 
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

     <TextField 
        label="email" 
        type="email" 
        value={identifier}
        onChange={setIdentifier}
        autoComplete="email"
    />

    <Button submit variant="primary">Register</Button>
   </Form>
 );
}

export default RegisterForm;