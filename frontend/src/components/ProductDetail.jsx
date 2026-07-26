import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useSearchParams } from "react-router-dom";
import { Page, Card, Text, BlockStack, DataTable } from "@shopify/polaris";

function ProductDetail() {
  const [product, setProduct] = useState(null)

  const [searchParams] = useSearchParams()
  const id  = searchParams.get("id")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

    useEffect(() => {
      const fetchProductDetail = async () => {
        // add ID guard before API request
        if (!id) {
          setError("Product ID is missing")
          setLoading(false)
          return
        }

        try {
          setLoading(true)
          setError("")

          // Shopify IDs could break with const res = await api.get(`/products/${id}`)
          const res = await api.get(`/products/single?id=${encodeURIComponent(id)}`)
          console.log(res)
          // data into state
          setProduct(res.product || null)
        } catch (err) {
          console.error("Failed to fetch product", err)
          setError(err.message || "Failed to load product")
        } finally {
          setLoading(false)
        }
      }

      fetchProductDetail()
    }, [id])

    // render guards
    if (loading) {
      return (
        <Page title="Product">
          <Text as="p">Loading product...</Text>
        </Page>
      )
    }

    if (error) {
      return (
        <Page title="Product">
          <Text as="p">{error}</Text>
        </Page>
      )
    }

    if (!product) {
      return (
        <Page title="Product">
          <Text as="p">Product not found</Text>
        </Page>
      )
    }

    // map over product.variants - name, sku, price, quantity
    const variantRows = (product.variants || []).map((variant) => [
      variant.title,
      variant.sku || "N/A",
      `$${variant.price}`,
      variant.inventoryQuantity ?? 0
    ])

    return (
      <Page
        title={product.name}
        primaryAction={{
          content: "Add Variant",
          onAction: () => console.log("Add variant"),
        }}
      >
        <BlockStack gap="400">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">Product Details</Text>
                <Text as="p">{product.description || "No product description available."}</Text>
              </BlockStack>
            </Card>
            <Card>
                <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Variants</Text>
                {variantRows.length === 0 ? (
                  <Text as="p">No variants yet.</Text>
                ) : (
                  <DataTable
                    columnContentTypes={["text", "text", "numeric", "numeric"]} // title, sku, price, quantity
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