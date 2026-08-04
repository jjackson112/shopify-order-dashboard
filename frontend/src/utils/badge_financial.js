export function financialTone(status) {
    switch(status?.toLowerCase()) {
        case "paid":
            return "success";
        case "pending":
            return "attention";
        case "refunded":
            return "warning";
        case "voided":
        case "failed":
            return "critical";
        default:
            return "info";
    }
}