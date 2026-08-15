import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import { Page, Card, Text, BlockStack, InlineGrid, Button } from "@shopify/polaris";
import { customerName } from "../utils/customer_name";

function Dashboard() {

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersCount, setOrdersCount] = useState(0)
  
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
        setOrdersCount(orderData.orders_count || 0)

        console.log("ORDER COUNT", orderData.orders_count)

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

  return (
    <div className="app-page">
      <Page>
        <div className="dashboard-title">
          <Text as="h1" variant="headingXl">
            Kona & Code Coffee Co. ☕
          </Text>
        </div>

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
                    <Text as="p" variant="bodyLg">{ordersCount}</Text>
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
                      products.slice(-5).map((product) => (
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
                        orders.slice(0, 5).map((order) => {
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
                    <Text as="h2" variant="headingMd">Recent Customers</Text>
                    {uniqueCustomers.size === 0 ? (
                      <Text as="p" tone="subdued">No customer information is available.</Text>
                    ) : (
                      Array.from(uniqueCustomers.values())
                        .slice(0, 5)
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
          </BlockStack>
        </div>
      </Page>
    </div>
  )
}

export default Dashboard;