import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Page, Card, Text, BlockStack, Button, DataTable,} from "@shopify/polaris";

function ProductDetail() {
    const [product, setProduct] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const res = await api.get(`/product/${id}`)
                console.log(res)

                // data into state
                setProduct(res.product)
            } catch (err) {
                console.log(err)
            }
        }
        fetchProductDetail()
    }, [id])
}

export default ProductDetail;