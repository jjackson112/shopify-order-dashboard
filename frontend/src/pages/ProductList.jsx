import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
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

      } catch (err) {
        console.log(err)
        setError(err.message, "Cannot fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
      <Page title="Products">
        <BlockStack gap="400">
          {products.length === 0 ? (
            <Card>
              <Text as="p">No products found.</Text>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id}>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    {product.title}
                  </Text>
                  <Text as="p">
                    {product.description}
                  </Text>
                  <Button
                    onClick={() => navigate(`/products/${encodeURIComponent(product.id)}`)}
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