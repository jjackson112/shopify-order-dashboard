import os
import requests

# configuration - get Shopify settings from .env
def shopify_config():
    return {
        "shop_domain": os.getenv("SHOPIFY_STORE_DOMAIN"),
        "access_token": os.getenv("SHOPIFY_ADMIN_ACCESS_TOKEN"),
        "api_version" : os.getenv("SHOPIFY_API_VERSION")
    }

# generic Shopify GraphQL Client - any query, send to Shopify + return JSON response
def shopify_graphql(query, variables=None):
    config = shopify_config()

    shop_domain = config["shop_domain"]
    access_token = config["access_token"]
    api_version = config["api_version"]

    if not shop_domain:
        raise RuntimeError("SHOPIFY_STORE_DOMAIN is missing")

    if not access_token:
        raise RuntimeError("SHOPIFY_ADMIN_ACCESS_TOKEN is missing")

    if not api_version:
        raise RuntimeError("SHOPIFY_API_VERSION is missing")

    # Admin GraphQL URL
    url = f"https://{shop_domain}/admin/api/{api_version}/graphql.json"
    
    # headers
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": access_token,
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
    print("TOKEN EXISTS:", bool(access_token))
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
def fetch_orders():
    query = """
    query {
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

                    pageInfo {
                        hasNextPage
                        hasPreviousPage
                        startCursor
                        endCursor
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
        }
    }
    """

    data = shopify_graphql(query)

    if data.get("errors"):
        print("ORDER LIST ERRORS", data["errors"])
    
    return [
        edge["node"]
        for edge in data["data"]["orders"]["edges"]
    ]

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