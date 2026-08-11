import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import { Page, Card, Text, BlockStack, InlineGrid, Button, Badge } from "@shopify/polaris";
import { customerName } from "../utils/customer_name";

function Dashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const username = localStorage.getItem("username") || "merchant"
  
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // customer count
  const customers = orders
    .map((order) => order.customer)
    .filter((customer) => customer?.id)
  
  const uniqueCustomers = new Map(
    customers.map((customer) => [customer.id, customer])
  )

  const customerCount = uniqueCustomers.size
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError("")

        const [productData, orderData] = await Promise.all([
          api.get("/products"),
          api.get("/orders/shopify"),
        ])
        
        // data into state
        setProducts(productData.products || [])
        setOrders(orderData.orders || [])

      } catch (err) {
        console.log(err)
        setError("Failed to load data to dashboard")

      } finally {
        setLoading(false)
      }
    }

      fetchDashboardData()
  }, [])

  // render guards
  if (loading) {
    return (
      <Text as="p" tone="subdued">Loading dashboard...</Text>
    )
  }

  if (error) {
    return (
      <Text as="p" tone="critical">{error}</Text>
    )
  }

  // counts were calculated in OrderList - add the .length
  const paidOrders = orders.filter(
    (order) => order.display_financial_status === "PAID"
  ).length

  const pendingOrders = orders.filter(
    (order) => order.display_financial_status === "PENDING"
  ).length

  const refundedOrders = orders.filter(
    (order) => order.display_financial_status === "REFUNDED"
  ).length

  const fulfilledOrders = orders.filter(
    (order) => order.display_fulfillment_status === "FULFILLED"
  ).length

  const unfulfilledOrders = orders.filter(
    (order) => order.display_fulfillment_status === "UNFULFILLED"
  ).length

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

      // convert the Map into an array to be converted
      const topProductList = Array.from(topProducts.entries())
    })
  })

  // sort() the top sellers before slice()
  const topThreeProducts = productList
    .sort((a, b) => {b[1] - a[1]})
    .slice(0, 3)

  return (
    <div className="app-page">
      <Page title="Shopify Order Dashboard">
          <Text as="p">{`Welcome, ${username}`}</Text>

        <div className="page-content">
          <BlockStack gap="400">
            <InlineGrid columns={{ xs: 1, sm: 1, md: 3 }} gap="400">
              <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">Total Products</Text>
                    <Text as="p" variant="bodyLg">{products.length}</Text>
                  </BlockStack>
              </Card>
              <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">Orders</Text>
                    <Text as="p" variant="bodyLg">{orders.length}</Text>
                  </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">Customers</Text>
                  <Text as="p" variant="bodyLg">{customerCount}</Text>
                </BlockStack>
              </Card>
            </InlineGrid>

            <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
              <div className="card-accent-caramel">
                <Card>
                    <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">Recent Products</Text>

                    {products.length === 0 ? (
                      <Text as="p">No products yet.</Text>
                    ) : (
                      products.slice(-3).map((product) => (
                        <Link
                          key={product.id}
                          className="dashboard-link"
                          to={(`/products/detail?id=${encodeURIComponent(product.id)}`)}
                        >
                          {product.title}
                        </Link>
                      ))
                    )}
                    <Button variant="primary" onClick={() => navigate("/products")}>View Products</Button>
                    </BlockStack>
                </Card>
              </div>

              <div className="card-accent-sage">
                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">Recent Orders</Text>

                    {orders.length === 0 ? (
                        <Text as="p">No orders yet.</Text>
                    ) : (
                        orders.slice(0, 3).map((order) => {
                          return (
                            <Link
                              key={order.id}
                              className="dashboard-link"
                              to={(`/orders/detail?id=${encodeURIComponent(order.id)}`)}
                            >
                              {order.name} - {customerName(order.customer) || "Guest"}
                            </Link>
                          )
                        })
                      )}
                      <Button variant="primary" onClick={() => navigate("/orders")}>View Orders</Button>
                  </BlockStack>
                </Card>
              </div>

              <div className="card-accent-espresso">
                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">Customer List</Text>
                    {uniqueCustomers.size === 0 ? (
                      <Text as="p" tone="subdued">No customer information is available.</Text>
                    ) : (
                      Array.from(uniqueCustomers.values())
                        .slice(0, 3)
                        .map((customer) => (
                          <div className="customer-text">
                            <Text as="p" key={customer.id}>{customerName(customer)}</Text>
                          </div>
                        ))
                    )}
                    <Button variant="primary" onClick={() => navigate("/customers")}>View Customers</Button>
                  </BlockStack>
                </Card>
              </div>
            </InlineGrid> 

            <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
              <div className="dashboard-stat">
                <Card>
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingMd">Order Status Summary</Text>
                    <InlineGrid columns="1fr auto" gap="200">
                      <Text as="p">Paid</Text>
                      <Badge tone="success">{paidOrders}</Badge>

                      <Text as="p">Pending</Text>
                      <Badge tone="attention">{pendingOrders}</Badge>

                      <Text as="p">Refunded</Text>
                      <Badge tone="critical">{refundedOrders}</Badge>

                      <Text as="p">Fulfilled</Text>
                      <Badge tone="success">{fulfilledOrders}</Badge>

                      <Text as="p">Unfulfilled</Text>
                      <Badge tone="attention">{unfulfilledOrders}</Badge>
                    </InlineGrid>
                  </BlockStack>
                </Card>
              </div>
              
              <div className="dashboard-stat">
                <Card>
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingMd">Top-Selling Products</Text>

                    <Text as="h3" variant="headingMd">Total Items Sold</Text>
                    {topThreeProducts.map((product) => (
                      <Text as="p" key={product[0]}>
                        {product[0]}: {product[1]} sold
                      </Text>
                    ))}
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

          </BlockStack>
        </div>
      </Page>
    </div>
  )
}

export default Dashboard;