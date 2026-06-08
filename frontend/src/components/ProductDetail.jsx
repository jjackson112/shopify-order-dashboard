import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useParams } from "react-router-dom";
import { Page, Card, Text, BlockStack, Button, DataTable,} from "@shopify/polaris";

function ProductDetail() {
    const [product, setProduct] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const res = await api.get(`/products/${id}`)
                console.log(res)

                // data into state
                setProduct(res.product)
            } catch (err) {
                console.log(err)
            }
        }
        fetchProductDetail()
    }, [id])

    // map over variants - title, sku, price, quantity

    return (
        <Page
          title={product.title}
          primaryAction={{
            content: "Add Variant",
            onAction: () => console.log("Add variant"),
          }}
        >
            <BlockStack gap="400">
                <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">Product Details</Text>
                    <Text as="p">{product.description}</Text>
                  </BlockStack>
                </Card>

                <Card>
                    <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">Variants</Text>

                    {variantRows.length === 0 ? (
                      <Text as="p">No variants yet.</Text>
                    ) : (
                      <DataTable
                        columnContentTypes={["text", "text", "text", "numeric"]}
                        headings={["Title", "SKU", "Price", "Quantity"]}
                        rows={variantRows}
                      />
                    )}
                    </BlockStack>
                </Card>
            </BlockStack>
        </Page>
  )
}

export default ProductDetail;