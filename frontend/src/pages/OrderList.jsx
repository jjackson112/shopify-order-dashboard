import { useState, useEffect } from "react";
import { api } from "../api/api";
import "../App.css";
import { Page, Card, Text, BlockStack, Badge, TextField, Select } from "@shopify/polaris"
import { customerName } from "../utils/customer_name";
import { fulfillmentTone } from "../utils/badge_fulfillment";
import { financialTone } from "../utils/badge_financial";

function OrderList() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("")

    // financial + fulfillment statuses filtered
    const paidOrders = orders.filter(
        (order) => order.display_financial_status === "PAID"
    )

    const pendingOrders = orders.filter(
        (order) => order.display_financial_status === "PENDING"
    )

    const refundedOrders = orders.filter(
        (order) => order.display_financial_status === "REFUNDED"
    )

    const fulfilledOrders = orders.filter(
        (order) => order.display_fulfillment_status === "FULFILLED"
    )

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
        <div className="app-page">
            <Page title="Orders">
                <div className="order-stats">
                    <Card>
                        <Text as="p">Total Orders: {orders.length}</Text>
                        <Text as="p">Paid: {paidOrders.length}</Text>
                        <Text as="p">Pending: {pendingOrders.length}</Text> 
                        <Text as="p">Refunded: {refundedOrders.length}</Text>
                        <Text as="p">Fulfilled: {fulfilledOrders.length}</Text>
                    </Card>
                </div>

                <BlockStack gap="400">
                    <InlineGrid>
                        <TextField
                            label="Search orders"
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by order number or customer name"
                        />
                        <Select
                            label="Sort orders"
                            value={sortBy}
                            onChange={setSortBy}
                            options={[
                                { label: "Newest first", value: "newest" },
                                { label: "Oldest first", value: "oldest" }
                            ]}
                        />  
                    </InlineGrid>

                    {orders.length === 0 ? (
                        <Card  key={order.id}>
                            <Text as="p">No orders found.</Text>
                        </Card>
                    ) : (
                        orders.map((order) => (
                            <div className="card-accent-sage">
                                <Card>
                                    <BlockStack gap="200">
                                        <Text as="h2" variant="headingMd">
                                            Order {order.name}
                                        </Text>
                                        
                                        <div className="badge-status">
                                            <Badge tone={financialTone(order.display_financial_status)}>
                                                Status: {order.display_financial_status || "Unknown"}
                                            </Badge>

                                            <Badge tone={fulfillmentTone(order.display_fulfillment_status)}>
                                                Status: {order.display_fulfillment_status || "Unknown"}
                                            </Badge>
                                        </div>

                                        <Text as="p">
                                            Name: {customerName(order.customer) || "Guest"}
                                        </Text>

                                        <Text as="p">
                                            Email: {order.email || order.customer?.email || "N/A"}
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
                            </div>
                        ))
                    )}
                </BlockStack>
            </Page>
        </div>
    )
}

export default OrderList;