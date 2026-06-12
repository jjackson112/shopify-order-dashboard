import os

def shopify_config():
    return {
        "shop_domain": os.getenv("SHOPIFY_STORE_DOMAIN"),
        "access_token": os.getenv("SHOPIFY_ADMIN_ACCESS_TOKEN"),
        "api_version" : os.getenv("SHOPIFY_API_VERSION")
    }

# Admin GraphQL URL
url = "https://"{SHOP_DOMAIN}"/admin/api/"{API_VERSION}/graphql.json"

# headers


# query
{
    product(first:10) {
        edges {
            node {
                id
                title
            }
        }
    }
}

# request

# return to JSON