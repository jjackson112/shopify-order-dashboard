import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useLocation } from "react-router-dom";

// useLocation lets one pass data when navigating between pages without calling to API

function OrderDetail() {
    const [showOrder, setShowOrder] = useState([])

    // const location = useLocation => const state = location.state
    const { state } = useLocation()

    // is state exists then return state.order or else undefined
    const order = state?.order

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const res = await api
    })


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
                                    Name: {customerName(order.customer) || "Guest"}
                                </Text>

                                <Text as="p">
                                    Email: {order.email}
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