import os
import requests

def shopify_config():
    return {
        "shop_domain": os.getenv("SHOPIFY_STORE_DOMAIN"),
        "access_token": os.getenv("SHOPIFY_ADMIN_ACCESS_TOKEN"),
        "api_version" : os.getenv("SHOPIFY_API_VERSION")
    }

def shopify_graphql(query):
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
        "query": query
    }

    # request


    # return to JSON
    return response.json