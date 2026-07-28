def normalize_order(order):
    # customer = order.get("customer") or {}
    # shipping_address = order.get("shippingAddress") or {}
    
    total_price_set = order.get("totalPriceSet") or {}
    shop_money = total_price_set.get("shopMoney") or {}

    # line items in shopify graphql don't exist in the normalized response - alternative solution
    line_items = []
            
    for edge in order.get("lineItems", {}).get("edges", []):
        item = edge.get("node") or {}
        
        line_items.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "quantity": item.get("quantity"),
            "sku": item.get("sku")
        })

    return {
        "id": order.get("id"),
        "name": order.get("name"),
        # "email": order.get("email"),
        "created_at": order.get("createdAt"),
        "display_financial_status": order.get(
            "displayFinancialStatus"
        ),   

        "display_fulfillment_status": order.get(
            "displayFulfillmentStatus"
        ),   

        "total_price": shop_money.get("amount"),
        "currency": shop_money.get("currencyCode"),
        "line_items": line_items,    

        "customer": None,
        "shipping_address": None,
        
        # "customer": {
        #    "id": customer.get("id"),
        #    "first_name": customer.get("firstName"),
        #    "last_name": customer.get("lastName"),
        #    "email": customer.get("email"),
        #    "phone": customer.get("phone"),
        # } if customer else None,   

        # "shipping_address": {
        #    "first_name": shipping_address.get("firstName"),
        #    "last_name": shipping_address.get("lastName"),
        #    "address1": shipping_address.get("address1"),
        #   "address2": shipping_address.get("address2"),
        #    "city": shipping_address.get("city"),
        #    "province": shipping_address.get("province"),
        #    "zip": shipping_address.get("zip"),
        #    "country": shipping_address.get("country"),
        # } if shipping_address else None
    }