import os
import requests

# configuration - get Shopify settings from .env
def shopify_config():
    return {
        "shop_domain": os.getenv("SHOPIFY_STORE_DOMAIN"),
        "client_id": os.getenv("SHOPIFY_CLIENT_ID"),
        "client_secret": os.getenv("SHOPIFY_CLIENT_SECRET"),
        "api_version" : os.getenv("SHOPIFY_API_VERSION")
    }

# authenticate app + return temporary token
# def get_shopify_access_token():


# generic Shopify GraphQL Client - any query, send to Shopify + return JSON response
def shopify_graphql(query, variables=None):
    config = shopify_config()

    shop_domain = config["shop_domain"]
    client_id = config["client_id"]
    client_secret = ["client_secret"]
    api_version = config["api_version"]

    if not shop_domain:
        raise RuntimeError("SHOPIFY_STORE_DOMAIN is missing")

    if not client_id:
        raise RuntimeError("CLIENT_ID is missing")

    if not client_secret:
        raise RuntimeError("CLIENT_SECRET is missing")
    
    if not api_version:
        raise RuntimeError("SHOPIFY_API_VERSION is missing")

    # Admin GraphQL URL
    url = f"https://{shop_domain}/admin/oauth/access_token"
    
    # headers
    headers = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    # query - only one endpoint
    payload = {
        "query": query, 
        "variables": variables or {},
    }

    # request
    response = requests.post(
        url,
        headers=headers,
        json=payload, 
        timeout=20,
    )

    print("SHOP DOMAIN:", shop_domain)
    print("API VERSION:", api_version)
    print("SHOPIFY STATUS:", response.status_code, flush=True)
    print("SHOPIFY RESPONSE:", response.text, flush=True)

    # TOKEN EXISTS is enough
    # print("TOKEN PREFIX:", access_token[:8] if access_token else None)

    # helper - raise an exception if Shopify sends back HTTP error response
    response.raise_for_status()

    data = response.json()

    if data.get("errors"):
        raise RuntimeError(f"Shopify GraphQL errors: {data['errors']}")
    
    # return to JSON
    return data

# get list of Shopify products
def fetch_products():
    query = """
    query {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
          }
        }
      }
    }
    """

    data = shopify_graphql(query)

    return [
        edge["node"]
        for edge in data["data"]["products"]["edges"]
    ]

# get single Shopify product
def fetch_single_product(product_id):
    query = f"""
    query {{
        product(id: "{product_id}") {{
            id
            title
            description
            variants(first:20) {{
                edges {{
                    node {{
                        id
                        title
                        sku
                        price
                        inventoryQuantity
                    }}
                }}
            }}
        }}
    }}
    """

    data = shopify_graphql(query)
    product = data["data"]["product"]

    product["variants"] = [
        edge["node"]
        for edge in product["variants"]["edges"]
    ]

    return product

# fetch Shopify orders - no need for db model 
# orders are live from Shopify - proof API works
# Shopify returns fields (name, displayFinancialStatus, totalPriceSet, createdAt)
def fetch_orders(first=10, after=None):
    query = """
    query GetOrders($first: Int!, $after: String) {
        orders(
            first: $first
            after: $after
            sortKey: CREATED_AT
            reverse: true
        ) {
            edges {
                cursor
                node {
                    id
                    name
                    email
                    createdAt
                    displayFinancialStatus
                    displayFulfillmentStatus

                    totalPriceSet {
                        shopMoney {
                            amount
                            currencyCode
                        }
                    }
                    
                    lineItems(first: 20) {
                        edges {
                            node {
                                id
                                name
                                quantity
                                sku

                                originalUnitPriceSet {
                                    shopMoney {
                                        amount
                                        currencyCode
                                    }
                                }
                            }
                        }
                    }

                    customer {
                        id
                        firstName
                        lastName
                        email
                        phone
                    }

                    shippingAddress {
                        address1
                        address2
                        city
                        province
                        zip
                        country
                    }
                }
            }

            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
    """

    variables = {
        "first": first,
        "after": after,
    }

    data = shopify_graphql(query, variables)

    # fetch_orders no longer returns just a list, but pagination too
    order_connection = data["data"]["orders"]

    orders = [
        edge["node"]
        for edge in order_connection["edges"]
    ]

    page_info = order_connection["pageInfo"]

    # if data.get("errors"):
    #    print("ORDER LIST ERRORS", data["errors"])
    
    return {
        "orders": orders,
        "page_info": page_info,
    }

# fetch single order
def fetch_single_order(order_id):
    query = """
    query GetOrder($id: ID!) {
        order(id: $id) {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus  
              
            totalPriceSet {
                shopMoney {
                    amount
                    currencyCode
                }  
            }

            lineItems(first: 20) {
                edges {
                    node {
                        id
                        name
                        quantity
                        sku

                        originalUnitPriceSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                    }
                }
            }
            
            customer {
                id
                firstName
                lastName
                email
                phone
            }
            
            shippingAddress {
                address1
                address2
                city
                province
                zip
                country
            }
        }
    }
    """

    variables = {"id": order_id}
    data = shopify_graphql(query, variables)

    if data.get("errors"):
        raise RuntimeError(
            f"Shopify GraphQL errors: {data['errors']}"
        )

    return data.get("data", {}).get("order")
    
# fetch variants
def fetch_variants():
    query = """
    query {
        products(first: 20) {
            edges {
                node {
                    id
                    name
                    description

                    variants(first: 10) {
                        edges {
                            node {
                                id
                                name
                                sku
                                price
                                inventoryQuantity
                            }
                        }
                    }
                }
            }
        }
    }
    """

    data = shopify_graphql(query)
    return [
        edge["node"]
        for edge in data["data"]["products"]["edges"]
    ]