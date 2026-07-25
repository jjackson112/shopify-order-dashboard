import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useLocation, useParams } from "react-router-dom";
import { Page, Card, Text, BlockStack } from "@shopify/polaris";
import { customerName } from "../utils/customer_name"

// useLocation lets one pass data when navigating between pages without calling to API

function OrderDetail() {
    const [showOrder, setShowOrder] = useState([])

    const { id } = useParams()
    // const location = useLocation => const state = location.state
    const { state } = useLocation()

    // is state exists then return state.order or else undefined
    const order = state?.order

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchOrderDetail = async => {
        try {
            setLoading(true)
            setError("")

            const res = await api.get(`/order/shopify/id?id=${encodeURIComponent(id)}`)
            console.log(res)

            setShowOrder(res.order)
        } catch (err) {
            console(err)
            setError(err.message || "Cannot show order")
        } finally {
            setLoading(false)
        }

        fetchOrderDetail()

    }, [id]})

    // render guards
    if (loading) {
        return (
            <Page title="Order">
                <Text as="p">Loading order...</Text>
            </Page>
        )
    }

    if (error) {
        return (
            <Page title="Order">
                <Text as="p" tone="critical">{error}</Text>
            </Page>
        )
    }

    if (!order) {
        return (
            <Page title="Order">
                <Text as="p">Order not found</Text>
            </Page>
        )
    }

    return (
        // backAction provides a back btn labeled orders that links to orders
        <Page title={`Order ${order.name}`} backAction={{content: "Orders", url: "/orders",}}>
            <BlockStack gap="400">
                <Card>
                    <BlockStack gap="200">
                        <Text as="h2" variant="headingMd">
                            Order Summary
                        </Text>

                        <Text as="p">
                            Name: {customerName(order.customer) || "Guest"}
                        </Text>

                        <Text as="p">
                            Email: {order.email}
                        </Text>
                        
                        <Text as="p">
                            Payment Status: {order.display_financial_status || "Unknown"}
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
            </BlockStack>
        </Page>
    )
}