import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useLocation } from "react-router-dom";

// useLocation lets one pass data when navigating between pages without calling to API

function OrderDetail() {
    const [showOrder, setShowOrder] = useState([])

    const { state } = useLocation()
    const order = state?.order

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
}