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
                console.log(err)
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
                                    {order.name || order.title || "Untitled order"}
                                </Text>
                                <Text as="p">
                                    Created: {order.createdAt}
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