# Shopify Order Dashboard

A full-stack order management dashboard that integrates with the Shopify Admin API to display product, order, and customer data.

The application features a React frontend, Flask REST API, Shopify GraphQL integration, authentication, webhook processing, and a responsive interface built with Shopify Polaris.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Shopify Polaris
- CSS

### Backend
- Python
- Flask
- Flask-SQLAlchemy
- REST APIs
- JWT authentication
- Gunicorn

### Data & Integrations
- PostgreSQL
- Shopify Admin GraphQL API
- Shopify Webhooks

### Infrastructure
- Docker / Docker Compose
- Render
- Cloudflare

## Features

- Merchant authentication with JWT
- Protected frontend and backend routes
- Shopify product and variant data
- Shopify order data and order details
- Customer information derived from orders
- Order search, sorting, and pagination
- Dashboard order and product metrics
- Shopify GraphQL API integration
- Shopify webhook processing
- Responsive interface
- Production deployment with Render
- Cloudflare Access protection for the live application

## Architecture

```text
Cloudflare Access
        |
        v
React Frontend
        |
        | REST API / JWT
        v
Flask Backend
      /       \
     v         v
PostgreSQL   Shopify Admin
             GraphQL API