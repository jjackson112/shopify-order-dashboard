import os

os.environ["SHOPIFY_WEBHOOK_SECRET"] = "test_secret"

import pytest
from app import create_app

# set test environment variable before importing create_app

@pytest.fixture
def client():
    app = create_app()

    app.config.update(
        TESTING=True
    )

    with app.test_client() as client:
        yield client