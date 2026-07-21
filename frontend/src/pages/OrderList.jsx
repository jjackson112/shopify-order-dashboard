import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Page, Card, Text, BlockStack } from "@shopify/polaris"

function OrderList() {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.get("/orders")
                console.log(data)

                setOrders(data.orders || [])
            } catch (err) {
                console.error("Failed to fetch orders", err)
            }
        }

        fetchOrders()
    }, [])

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
                                    Order #{order.order_number}
                                </Text>
                                
                                <Text as="p">
                                    Status: {order.order_status}
                                </Text>

                                <Text as="p">
                                    Total: ${order.total_price}
                                </Text>

                                <Text as="p">
                                    Created: {""}
                                    {order.created_at
                                        ? new Date(order.created_at).toLocaleDateString()
                                        : "Unknown"}
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