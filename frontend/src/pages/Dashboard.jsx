import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Page, Card, Text, BlockStack, InlineGrid, Button } from "@shopify/polaris";
import { customerName } from "../utils/customer_name";

function Dashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const username = localStorage.getItem("username") || "merchant"
  
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
          const res = await api.get("/products")
          console.log(res)
          // data into state
          setProducts(res.products || [])
      } catch (err) {
          console.log(err)
      }
    }

      fetchProducts()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get("/orders/shopify")
        setOrders(data.orders || [])
      } catch (err) {
        console.log(err)
      }
    }

    fetchOrders()
  }, [])

  // const handleView = (id) => {navigate(`/products/${id}`)}

  return (
    <Page title={`Welcome, ${username}`}>
      <BlockStack gap="400">
        <InlineGrid columns={2} gap="400">
          <Card>
            <Text as="h2" variant="headingMd">Total Products</Text>
            <Text as="p" variant="bodyLg">{products.length}</Text>
          </Card>
          <Card>
            <Text as="h2" variant="headingMd">Orders</Text>
            <Text as="p" variant="bodyLg">{orders.length}</Text>
          </Card>
        </InlineGrid>
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
                    onClick={() => navigate("/products")}
                  >
                    {product.name}
                  </Button>
                ))
              )}
              <Button variant="primary" onClick={() => navigate("/products")}>View Products</Button>
              </BlockStack>
          </Card>
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
                          onClick={() => navigate(`/orders/${encodeURIComponent(id)}`)}
                      >
                        {order.name} - {customerName(order.customer) || "Guest"}
                      </Button>
                    )
                  })
                )}
                <Button variant="primary" onClick={() => navigate("/orders")}>View Orders</Button>
            </BlockStack>
          </Card>
        </BlockStack>
    </Page>
  )
}

export default Dashboard;