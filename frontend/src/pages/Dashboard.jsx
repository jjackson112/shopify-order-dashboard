import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Page, Card, Text, BlockStack, InlineGrid, Button } from "@shopify/polaris";
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
  {loading && (
    <Text as="p" tone="subdued">Loading dashboard...</Text>
  )}

  {error && (
    <Text as="p" tone="critical">{error}</Text>
  )}

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
                      products.slice(0, 5).map((product) => (
                        <Button 
                          key={product.id}
                          variant="plain"
                          onClick={() => navigate(`/products/detail?id=${encodeURIComponent(product.id)}`)}
                        >
                          {product.title}
                        </Button>
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
                            <Button
                                key={order.id}
                                variant="plain"
                                onClick={() => navigate(`/orders/detail?id=${encodeURIComponent(order.id)}`)}
                            >
                              {order.name} - {customerName(order.customer) || "Guest"}
                            </Button>
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
                    <Text as="h2" variant="headingMd">Customers</Text>
                    {uniqueCustomers.size === 0 ? (
                      <Text as="p" tone="subdued">No customer information is available.</Text>
                    ) : (
                      Array.from(uniqueCustomers.values())
                        .slice(0, 5)
                        .map((customer) => (
                          <Text as="p" key={customer.id}>{customerName(customerName(customer))}</Text>
                        ))
                    )}
                    <Button variant="primary">View Customers</Button>
                  </BlockStack>
                </Card>
              </div>
            </InlineGrid> 

            <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
              <Card>
                <BlockStack>
                  <Text as="h3" variant="headingMd">Order Status Summary</Text>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack>
                  <Text as="h3" variant="headingMd">Low Inventory Products</Text>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack>
                  <Text as="h2" variant="headingMd">Recent Activity</Text>
                </BlockStack>
              </Card>
            </InlineGrid>

          </BlockStack>
        </div>
      </Page>
    </div>
  )
}

export default Dashboard;