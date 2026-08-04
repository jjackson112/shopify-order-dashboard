export function fulfillmentTone(status) {
    switch (status?.toLowerCase()) {
        case "fulfilled":
            return "success";
        case "unfulfilled":
            return "attention";
        case "partial":
            return "warning";
        default:
            return "informational";
    }
}