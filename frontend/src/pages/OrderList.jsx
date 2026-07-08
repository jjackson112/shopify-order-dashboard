import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Page, Card, Text, BlockStack } from "@shopify/polaris"

function OrderList() {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.get("/orders")
                console.log(data)

                setOrders(data.orders || [])
            } catch (err) {
                console.log(err)
            }
        }

        fetchOrders()
    }, [])
}