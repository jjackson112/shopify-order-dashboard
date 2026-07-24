export function formatCustomerName(customer) {
    return [
        customer?.first_name,
        customer?.last_name,
    ]
        .filter(Boolean)
        .join(" ")
}