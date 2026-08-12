import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useSearchParams } from "react-router-dom";
import "../App.css"
import { Page, Card, Text, BlockStack } from "@shopify/polaris";
import { customerName } from "../utils/customer_name"

function OrderDetail() {
    const [order, setOrder] = useState(null)

    const [searchParams] = useSearchParams()
    const id  = searchParams.get("id")

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchOrderDetail = async () => {
        // ID guard before making the API request
            if (!id) {
                setError("Order is missing")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError("")

                const res = await api.get(`/orders/single?id=${encodeURIComponent(id)}`)
                console.log(res)

                setOrder(res.order || null)
            } catch (err) {
                console.error(err)
                setError(err.message || "Cannot show order")
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetail()

    }, [id])

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

    // find total item quantity, not just the number of entries in each order
    // no more {order.line_items?.length} use reduce() to get single output
    const totalItemQuantity = order.line_items?.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    ) || 0

    // backAction provides a back btn labeled orders that links to orders

    return (
        <div className="app-page">
            <Page title={`Order ${order.name}`}>
                <BlockStack gap="400">
                    <div className="card-accent-sage">
                        <Card>
                            <BlockStack gap="200">
                                <Text as="h2" variant="headingMd">
                                    Order Summary
                                </Text>

                                <Text as="p">
                                    Name: {customerName(order.customer) || "Guest"}
                                </Text>

                                <Text as="p">
                                    Email: {order.email || order.customer?.email || "N/A"}
                                </Text>

                                <Text as="p">
                                    Payment Status: {order.display_financial_status || "Unknown"}
                                </Text>

                                <Text as="p">
                                    Total: {" "}
                                    ${order.total_price || "0.00"}{" "}
                                    {order.currency || ""}
                                </Text>

                                <Text as="p">
                                    Created: {""}
                                    {order.created_at
                                        ? new Date(order.created_at).toLocaleDateString()
                                        : "Unknown"}
                                </Text>
                                
                                <Text as="p">
                                    Order Items:
                                </Text>
                                {order.line_items?.length > 0 ? (
                                    <BlockStack gap="200">
                                        {order.line_items?.map((item) => (
                                            <div key={item.id}>
                                                <Text as="p">{item.name} x {item.quantity}</Text>
                                            </div>
                                        ))}
                                    </BlockStack>
                                ) : (
                                    <Text as="p">No items available.</Text>
                                )}

                                <Text as="p" tone="subdued">Total Items: {totalItemQuantity}</Text>

                                {order.shipping_address ? (
                                    <BlockStack gap="100">
                                        <Text as="p">
                                            Shipping Address: {""}
                                            {order.shipping_address.address1}, {order.shipping_address.address2}
                                            {order.shipping_address.city}, {order.shipping_address.province}{" "}
                                            {order.shipping_address.zip}
                                        </Text>

                                        <Text>{order.shipping_address.country}</Text>
                                    </BlockStack>
                                ) : (
                                    <Text as="p" tone="subdued">No shipping address is available</Text>
                                )}
                            </BlockStack>
                        </Card>
                    </div>
                </BlockStack>
            </Page>
        </div>
    )
}

export default OrderDetail;