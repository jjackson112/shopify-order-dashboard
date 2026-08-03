import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Page, Card, Text, BlockStack, Button } from "@shopify/polaris";

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError("")

        const data = await api.get("/products")
        console.log(data)
        
        setProducts(data.products || [])
        console.log("PRODUCTS ARRAY:", data.products)

      } catch (err) {
        console.log(err)
        setError(err.message || "Cannot fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // render guards
  if (loading) {
    return (
      <Page title="Products">
        <Text as="p">Loading products...</Text>
      </Page>
    )
  }

  if (error) {
    return (
      <Page title="Products">
        <Text as="p" tone="critical">
          {error}
        </Text>
      </Page>
    )
  }

  return (
      <Page title="Products">
        <BlockStack gap="400">
          {products.length === 0 ? (
            <Card className="card-accent-caramel">
              <Text as="p">No products found.</Text>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="card-accent-caramel">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    {product.title || "Product name unavailable"}
                  </Text>
                  <Text as="p">
                    {product.description || "Description unavailable"}
                  </Text>
                  <Button
                    onClick={() => navigate(`/products/detail?id=${encodeURIComponent(id)}`)}
                  >
                    View Product
                  </Button>
                </BlockStack>
              </Card>
            ))
          )}
        </BlockStack>
      </Page>
  )
}

export default ProductList;