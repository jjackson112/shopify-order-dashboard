import { useState, useEffect } from "react";
import { api } from "../api/api";
import "../App.css";
import { Page, Card, Text, BlockStack, InlineGrid, Button } from "@shopify/polaris";
import { customerName } from "../utils/customer_name";

function CustomerList() {
    const [customers, setCustomers] = useState([])

    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("name")

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const displayCustomer = customers
        .filter((customer) => {
            const name = customerName(customer).toLowerCase()
            const email = (customer.email || "").toLowerCase()
            const query = search.toLowerCase().trim()

            return name.includes(query) || email.includes(query)
        })

        .sort((a, b) => {
            if (sortBy === "email") {
                return (a.email || "").localCompare(b.email || "") // compare 2 strings based on current locale
            }

            return customerName(a).localCompare(customerName(b))
        })

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

                // loop through the orders, extract them + create an array
                orders.forEach((order) => {
                    const customer = order.customer

                    if (customer?.id) {
                        uniqueCustomers.set(customer.id, customer)
                    }
                })

                const customerList = Array.from(uniqueCustomers.values())
                setCustomers(customerList)

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
                <div className="page-content">
                    <BlockStack gap="400">
                        {customers.length === 0 ? (
                            <Card>
                                <Text as="p" tone="subdued">There are no customers.</Text>
                            </Card>
                        ) : (
                            <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }}>
                                {customers.map((customer) => (
                                    <Card key={customer.id}>
                                        <BlockStack gap="200">
                                            <Text as="p" variant="headingMd">{customerName(customer) || "Guest"}</Text>
                                            <Text as="p">Email: {customer.email || "N/A"}</Text>
                                            <Text as="p">Phone: {customer.phone || "N/A"}</Text>
                                        </BlockStack>
                                    </Card>
                                ))}
                            </InlineGrid>
                        )}
                </BlockStack>
                </div>
            </Page>
        </div>
    )
}

export default CustomerList;