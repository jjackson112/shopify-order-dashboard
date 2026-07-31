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

                // customer objects are already included with /orders/shopify URL
                const data = await api.get("/orders/shopify")
                // extract the orders
                const orders = data.orders || []

                // a customer may have multiple orders - have them only appear once on this page
                const uniqueCustomers = new Map()

                //
                orders.forEach((order) => {
                    const customer = order.customer

                    if (customer?.id) {
                        uniqueCustomers.set(customer.id, customer)
                    }

                    Array.from(uniqueCustomers.values())
                })

            } catch (err) {
                console.log(err)
                setError("Cannot fetch customer list")
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    // render guards
    if (loading) {
        return (
            <Text as="p" tone="subdued">Loading customers...</Text>
        )
    }

    if (error) {
        return (
            <Text as="p" tone="critical">{error}</Text>
        )
    }

    return (
        <div className="app-page">
            <Page title="Customers">

            </Page>
        </div>
    )
}

export default CustomerList;