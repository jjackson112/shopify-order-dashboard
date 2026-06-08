import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { Page, Card, Text, BlockStack, InlineGrid, Button } from "@shopify/polaris";

function Dashboard() {
    const [products, setProducts] = useState([])

    const username = localStorage.getItem("username") || "merchant"

    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products")
                console.log(res)

                // data into state
                setProducts(res.products)
            } catch (err) {
                console.log(err)
            }
        }
        fetchProducts()
    }, [])

    const handleView = (id) => {
        navigate(`/products/${id}`)
    }

    return (
        <Page title={`Welcome, ${username}`}>
            <BlockStack gap="400">
              <InlineGrid columns={2} gap="400">
                <Card>
                  <Text as="h2" variant="headingMd">Total Products</Text>
                  <Text as="p" variant="bodyLg">{products.length}</Text>
                </Card>

                <Card>
                  <Text as="h2" variant="headingMd">Total Variants</Text>
                  <Text as="p" variant="bodyLg">Coming soon</Text>
                </Card>
              </InlineGrid>

                <Card>
                    <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">Recent Products</Text>
        
                    {products.length === 0 ? (
                      <Text as="p">No products yet.</Text>
                    ) : (
                      products.slice(0, 5).map((product) => (
                        <Text as="p" key={product.id}>
                          {product.title}
                        </Text>
                      ))
                    )}
    
                    <Button variant="primary">View Products</Button>
                    </BlockStack>
                </Card>
            </BlockStack>
        </Page>
    )
}

export default Dashboard;