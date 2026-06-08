import { useState } from "react";
import { Form, FormLayout, TextField, Button } from "@shopify/polaris";

// autocomplete (boolean) gives the browser the ability to autocomplete input elements

function LoginForm() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")

 return (
   <Form>
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