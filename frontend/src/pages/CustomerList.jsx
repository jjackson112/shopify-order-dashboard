import { useState, useEffect } from "react";
import { api } from "../api/api";
import "../App.css";
import { Page, Card, Text, BlockStack, InlineGrid, TextField, Select, Badge } from "@shopify/polaris";
import { customerName } from "../utils/customer_name";
import { financialTone } from "../utils/badge_financial";

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const query = search.toLowerCase().trim()

  const displayCustomers = [...customers]
    .filter((customer) => {
      const name = customerName(customer).toLowerCase()
      const email = (customer.email || "").toLowerCase()
      return name.includes(query) || email.includes(query)
    })

    .sort((a, b) => {
      if (sortBy === "email") {
        if (!a.email && !b.email) return 0 // first condition - treat 2 customers with no email as equal
        if (!a.email) return 1 // second condition - compare a customer with an email (true because it's null) with one who doesn't - put A after B
        if (!b.email) return -1 // third condition - if customer b is null or missing, then A with the email stays ahead (A before B)
        
        return a.email.localeCompare(b.email) // runs only if both customers have emails
      }

      return customerName(a).localeCompare(customerName(b))
    })

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        setError("")

        // customer objects are already included with /orders/shopify URL
        const data = await api.get("/orders/shopify")
        // extract the orders
        const orders = data.orders || []
        // a customer may have multiple orders - have them only appear once on this page
        const uniqueCustomers = new Map()
        // count the orders in the loop
        const orderCount = new Map()

        // loop through the orders, extract them + create an array
        orders.forEach((order) => {
          const customer = order.customer

          if (customer?.id) return

          uniqueCustomers.set(customer.id, customer)

          orderCount.set(customer.id, orderCount(get(customer.id) || 0) + 1)
        })

        const customerList = Array.from(uniqueCustomers.values())
        setCustomers(customerList)

      } catch (err) {
        console.log(err)
        setError("Cannot fetch customer list")

      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // render guards
  if (loading) {
    return (
      <Text as="p" tone="subdued">Loading customers...</Text>
    )
  }

  if (error) {
    return (
      <Text as="p" tone="critical">{error}</Text>
    )
  }

  return (
    <div className="app-page">
      <Page title="Customers">
        <div className="page-content">
          <BlockStack gap="400">
            <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
              <TextField
                label="Search customers"
                value={search}
                onChange={setSearch}
                placeholder="Search by name or email"
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setSearch("")}
              />
              <Select
                label="Sort customers"
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { label: "Name A–Z", value: "name" },
                  { label: "Email A–Z", value: "email" },
                ]}
              />
            </InlineGrid>
            {customers.length === 0 ? (
              <Card>
                <Text as="p" tone="subdued">
                  There are no customers.
                </Text>
              </Card>
            ) : displayCustomers.length === 0 ? (
              <Card>
                <Text as="p" tone="subdued">
                  No customers match your search.
                </Text>
              </Card>
            ) : (
              <InlineGrid
                columns={{ xs: 1, sm: 2, md: 3 }}
                gap="400"
              >
                {displayCustomers.map((customer) => (
                  <Card key={customer.id}>
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingMd">
                        {customerName(customer) || "Guest"}
                      </Text>
                      <Text as="p">
                        Email: {customer.email || "N/A"}
                      </Text>
                      <Text as="p">
                        Phone: {customer.phone || "N/A"}
                      </Text>
                      <Text as="p">
                        Orders {orderCount.length || 0}
                      </Text>
                      <Text as="p">
                        Total Spent: 
                      </Text>
                      <Text as="p">
                        Last Order: 
                      </Text>
                    </BlockStack>
                  </Card>
                ))}
              </InlineGrid>
            )}
          </BlockStack>
        </div>
      </Page>
    </div>
  )
}

export default CustomerList;