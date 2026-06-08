import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [products, setProducts] = useState([])

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
        
    )
}

export default Dashboard;