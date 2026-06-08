import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";

function ProductList() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.get("/products")
                console.log(data)

                setProducts(data.products || [])
            } catch (err) {
                console.log(error)
            }
        }
        fetchProducts()
    }, [])

}

export default ProductList;