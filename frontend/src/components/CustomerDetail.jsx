import { useEffect, useState } from "react";
import { api } from "../api";
import "../App.css";
import { useSearchParams } from "react-router-dom";
import { customerName } from "../utils/customer_name";

function CustomerDetail() {
    const [customer, setCustomer] = useState([])

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


            } catch (err) {
                console.log(err)
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