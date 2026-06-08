import { Page, Card, Button, Text } from '@shopify/polaris';

export default function Dashboard() {
    return (
        <Page title="Shopify Order Dashboard">
            <Card>
                <Text as="h2" variant="headingLg">
                    Polaris works!
                </Text>

                <Button variant="primary">
                    Create Product
                </Button>
            </Card>
        </Page>
    )
}