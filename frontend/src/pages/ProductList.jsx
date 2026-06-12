import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Page, Card, Text, BlockStack, Button } from "@shopify/polaris";

function ProductList() {
    const [products, setProducts] = useState(["mock_product"])

    const navigate = useNavigate()

    // mock data for testing
    const mock_product = [
      { id: 1, title: "Sample Product", description: "Sample description"},
    ]

    //useEffect(() => {
        //const fetchProducts = async () => {
            //try {
                //const data = await api.get("/products")
                //console.log(data)

                //setProducts(data.products || [])
            //} catch (err) {
               // console.log(err)
           // }
        //}
        //fetchProducts()
    //}, [])

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
                      onClick={() => navigate(`/products/${product.id}`)}
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