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
        json=payload
    )

    print("SHOP DOMAIN:", shop_domain)
    print("API VERSION:", api_version)
    print("TOKEN EXISTS:", bool(access_token))
    print("TOKEN PREFIX:", access_token[:8] if access_token else None)

    # helper - raise an exception if Shopify sends back HTTP error response
    response.raise_for_status()
    
    # return to JSON
    return response.json()

# get list of Shopify products
def fetch_products():
    query = """
    query {
      products(first: 20) {
        edges {
          node {
            id
            name: title
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
            name: title
            description
            variants(first:20) {{
                edges {{
                    node {{
                        id
                        name: title
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
        orders(first: 20) {
            edges {
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
        }
    }
    """

    data = shopify_graphql(query)
    
    return [
        edge["node"]
        for edge in data["data"]["orders"]["edges"]
    ]

# fetch single order
def fetch_single_order(order_id):
    query = """
    query GetOrder ($id: ID!) {
        order (id: $id) {
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
                firstName
                lastName
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
                                title
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