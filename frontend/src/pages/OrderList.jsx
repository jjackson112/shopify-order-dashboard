import { useState, useEffect } from "react";
import { api } from "../api/api";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { Page, Card, Text, BlockStack, Badge, InlineGrid, TextField, Select, Button } from "@shopify/polaris"
import { customerName } from "../utils/customer_name";
import { fulfillmentTone } from "../utils/badge_fulfillment";
import { financialTone } from "../utils/badge_financial";

function OrderList() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("newest")

    const [pages, setPages] = useState(0)
    const [page, setPage] = useState(1) // current page
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)

    const navigate = useNavigate()

    const query = search.toLowerCase().trim()

    const showOrders = [...orders]
        .filter((order) => {
            const name = customerName(order.customer).toLowerCase()
            const orderNumber = (order.name || "").toLowerCase()

            return name.includes(query) || orderNumber.includes(query)
        })

        .sort((a, b) => {
            if (sortBy ==="oldest") {
                return new Date(a.created_at) - new Date(b.created_at)
            }

            if (sortBy === "order-asc") {
                return (a.name || "").localeCompare(b.name || "", undefined, {
                numeric: true,
                })
            }

            if (sortBy === "order-desc") {
              return (b.name || "").localeCompare(a.name || "", undefined, {
                numeric: true,
              })
            }

            if (sortBy === "customer") {
                return customerName(a.customer).localeCompare(customerName(b.customer))
            }

            // default - newest first
            return new Date(b.created_at) - new Date(a.created_at)
        })

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

    const unfulfilledOrders = orders.filter(
        (order) => order.display_fulfillment_status === "UNFULFILLED"
    )

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError("")

                const data = await api.get(`/orders/shopify?page=${page}`)
                console.log("SHOPIFY ORDERS", data.orders)

                setOrders(data.orders || [])
                setPages(data.pages || 0)
                setHasNext(Boolean(data.has_next))
                setHasPrev(Boolean(data.has_prev))

                console.log("CURRENT PAGE", page)
                console.log("PAGINATION", {
                    pages: data.pages,
                    hasNext: data.has_next,
                    hasPrev: data.has_prev
                })

            } catch (err) {
                console.error("Failed to fetch orders", err)
                setError("Failed to fetch orders")

            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [page]) // run whenever page changes

    // use reduce() for revenue summary
  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total_price || 0), 
    0
  )

  // pending payments with reduce()
  const pendingPayments = orders.reduce(
    (total, order) => {
      if (order.display_financial_status === "PENDING") {
        return total + Number(order.total_price || 0)
      }

      return total
    },
    0
  )

  // create new Map to loop over orders for top selling products
  const topProducts = new Map

  orders.forEach((order) => {
    order.line_items?.forEach((item) => {
      // add quantity
      const productQuantity = topProducts.get(item.name) || 0

      // store products
      topProducts.set(item.name, productQuantity + item.quantity)
    })
  })

  // convert the Map into an array to be converted
  const topProductList = Array.from(topProducts.entries())

  // sort() the top sellers before slice()
  const topThreeProducts = topProductList
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // total items sold - extract from line items + use reduce()
  // nested array inside the other - outer and inner
  const totalProductsSold = orders.reduce(
    (total, order) => {
      const orderTotal = order.line_items.reduce(
        (sum, item) => {
          // add item.quantity to sum
          return sum + (item.quantity || 0)
        },
        0
      )

      return total + orderTotal
    },
    0
  )

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
            <Page>
                <div className="order-title">
                    <Text as="h1" variant="headingXl">Orders</Text>
                </div>

                <div className="order-stats">
                    <Card>
                        <InlineGrid 
                            columns={{ xs: 1, sm: 2, md: 3, lg: 6 }}
                            gap="400"
                        >
                            <Card>
                                <Text as="p" variant="headingMd">{orders.length}</Text>
                                <Badge as="p" tone="subdued">Total Orders</Badge>
                            </Card>

                            <Card>
                                <Text as="p" variant="headingMd">{paidOrders.length}</Text>
                                <Badge as="p" tone="success">Paid</Badge>
                            </Card>

                            <Card>
                                <Text as="p" variant="headingMd">{pendingOrders.length}</Text> 
                                <Badge as="p" tone="attention">Pending</Badge> 
                            </Card>

                            <Card>
                                <Text as="p" variant="headingMd">{refundedOrders.length}</Text>
                                <Badge as="p" tone="critical">Refunded</Badge>
                            </Card>

                            <Card>
                                <Text as="p" variant="headingMd">{fulfilledOrders.length}</Text>
                                <Badge as="p" tone="success">Fulfilled</Badge>
                            </Card>

                            <Card>
                                <Text as="p" variant="headingMd">{unfulfilledOrders.length}</Text>
                                <Badge as="p" tone="attention">Unfulfilled</Badge>
                            </Card>

                        </InlineGrid>
                    </Card>
                </div>

                <div className="other-stats">
                    <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">

                        <div className="dashboard-stat">
                          <Card>
                            <BlockStack gap="300">
                              <Text as="h3" variant="headingMd">Top-Selling Products</Text>
                              {topThreeProducts.map((product) => (
                                <Text as="p" key={product[0]}>
                                  {product[0]}: {product[1]} sold
                                </Text>
                              ))}
                                <Text as="h2" variant="headingMd">Total Items Sold</Text>
                                <Text as="p">{totalProductsSold}</Text>
                            </BlockStack>
                          </Card>
                        </div>

                        <div className="dashboard-stat">
                          <Card>
                            <BlockStack gap="300">
                                <Text as="h2" variant="headingMd">Revenue Summary</Text>
                                <Text as="p">Total Revenue: ${totalRevenue.toFixed(2)}</Text>

                                <Text as="h2" variant="headingMd">Pending Payments</Text>
                                <Text as="p">${pendingPayments}</Text>
                            </BlockStack>
                          </Card>
                        </div>
                    </InlineGrid>
                </div>

                <BlockStack gap="400">
                    <div className="sort-orders">
                        <InlineGrid   
                            columns={{ xs: 1, md: "1fr 1fr auto auto" }}
                            gap="400"
                            alignItems="center"
                        >
                            <TextField
                                label="Search orders"
                                value={search}
                                onChange={setSearch}
                                placeholder="Search by order number or customer name"
                                autoComplete="off"
                                clearButton
                                onClearButtonClick={() => setSearch("")}
                            />
                            <Select
                                label="Sort orders"
                                value={sortBy}
                                onChange={setSortBy}
                                options={[
                                    { label: "Newest first", value: "newest" },
                                    { label: "Oldest first", value: "oldest" },
                                    { label: "Order number ascending", value: "order-asc"},
                                    { label: "Order number descending", value: "order-desc"},
                                    { label: "Customer name A-Z", value: "customer"},
                                ]}
                            />  
                        </InlineGrid>
                    </div>
                    
                    <div className="pagination">
                        <Button onClick={() => setPage(prev => prev - 1)} disabled={!hasPrev}>Previous</Button>

                        {Array.from({ length: pages }, (_, index) => {
                            const pageNumber = index + 1

                            return (
                                <Button
                                    key={pageNumber}
                                    variant={page === pageNumber ? "primary" : "secondary"}
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            )
                        })}

                        <Button onClick={() => setPage(prev => prev + 1)} disabled={!hasNext}>Next</Button>
                    </div>

                    {orders.length === 0 ? (
                        <Card>
                            <Text as="p">No orders found.</Text>
                        </Card>
                    ) : showOrders.length === 0 ? (
                        <Card>
                            <Text as="p">No orders match your search.</Text>
                        </Card>
                    ) :  (
                        showOrders.map((order) => (
                            <div className="card-accent-sage" key={order.id}>
                                <Card>
                                    <BlockStack gap="200">
                                        <Text as="h2" variant="headingMd">
                                            Order {order.name}
                                        </Text>
                                        
                                        <div className="badge-status">
                                            <Badge tone={financialTone(order.display_financial_status)}>
                                                Financial Status: {" "}
                                                {order.display_financial_status || "Unknown"}
                                            </Badge>

                                            <Badge tone={fulfillmentTone(order.display_fulfillment_status)}>
                                                Fulfillment Status: {" "}
                                                {order.display_fulfillment_status || "Unknown"}
                                            </Badge>
                                        </div>

                                        <Text as="p">
                                            Name: {customerName(order.customer) || "Guest"}
                                        </Text>

                                        <Text as="p">
                                            Email: {order.email || order.customer?.email || "N/A"}
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
                                            Items: {order.line_items?.length || 0}
                                        </Text>

                                        <Button 
                                            variant="tertiary"
                                            onClick={() => navigate(`/orders/detail?id=${encodeURIComponent(order.id)}`)}
                                        >
                                            View Order
                                        </Button>
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