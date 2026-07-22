import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Page, Card, Text, BlockStack } from "@shopify/polaris"

function OrderList() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError("")

                const data = await api.get("/orders/shopify")
                console.log("SHOPIFY ORDERS", data.orders)
                setOrders(data.orders || [])
            } catch (err) {
                console.error("Failed to fetch orders", err)
                setError("Failed to fetch orders")
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    // render guards
    if (loading) {
        return (
            <Page title="Orders">
                <Text as="p">Loading orders...</Text>
            </Page>
        )
    }

    if (error) {
        return (
            <Page title="Orders">
                <Card>
                    <Text as="p">{error}</Text>
                </Card>
            </Page>
        )
    }

    return (
        <Page title="Orders">
            <BlockStack gap="400">
                {orders.length === 0 ? (
                    <Card>
                        <Text as="p">No orders found.</Text>
                    </Card>
                ) : (
                    orders.map((order) => (
                        <Card key={order.id}>
                            <BlockStack gap="200">
                                <Text as="h2" variant="headingMd">
                                    Order {order.name}
                                </Text>
                                
                                <Text as="p">
                                    Status: {order.display_financial_status || "Unknown"}
                                </Text>

                                <Text as="p">
                                    Total: 
                                    ${order.total_price || "0.00"}{""}
                                    {order.currency || ""}
                                </Text>

                                <Text as="p">
                                    Created: {""}
                                    {order.created_at
                                        ? new Date(order.created_at).toLocaleDateString()
                                        : "Unknown"}
                                </Text>

                                <Text as="p">
                                    Items: {order.line_items?.length || 0}
                                </Text>
                            </BlockStack>
                        </Card>
                    ))
                )}
            </BlockStack>
        </Page>
    )
}

export default OrderList;