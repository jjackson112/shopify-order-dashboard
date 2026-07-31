import { useEffect, useState } from "react";
import { api } from "../api";
import "../App.css";
import { useSearchParams } from "react-router-dom";
import { customerName } from "../utils/customer_name";

function CustomerDetail() {
    const [showCustomer, setShowCustomer] = useState([])

    const [searchParams] = useSearchParams()
    const customerId = searchParams.get("id")

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCustomerDetail = async () => {
            try {
                setLoading(true)
                setError("")

                const data = await api.get("/orders/shopify")
                console.log(data)

                setShowCustomer(data.showCustomer || [])

            } catch (err) {
                console.log(error)
                setError(err.message || "Customer details unavailable")
            } finally {
                setLoading(false)
            }
        }

        fetchCustomerDetail()

    }, [])


    return ()
}

export default CustomerDetail;