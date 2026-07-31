import { useState, useEffect } from "react";
import { api } from "../api/api";
import "../App.css";
import { Page, Card, Text, BlockStack, InlineGrid, Button } from "@shopify/polaris";
import { customerName } from "../utils/customer_name";

function CustomerList() {
    const [customer, setCustomer] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true)
                setError("")
            } catch (err) {
                console.log(err)
                setError("Cannot fetch customer list")
            } finally {
                setLoading(false)
            }
        }
    })
}

export default CustomerList;