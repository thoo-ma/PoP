import type { ComponentStory } from '@/components/dev/storyTypes'
import { Alert, Button } from '@/components/ui'

export const alertStories: ComponentStory = {
  componentName: 'Alert',
  description:
    'Brand-baked Alert with status indicator, title, and description. 5 status variants.',
  groups: [
    {
      title: 'Status Variants',
      items: [
        {
          label: 'Default',
          render: () => (
            <Alert status="default" className="w-full">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Default notice</Alert.Title>
                <Alert.Description>
                  This is a default alert with no particular status.
                </Alert.Description>
              </Alert.Content>
            </Alert>
          ),
        },
        {
          label: 'Accent',
          render: () => (
            <Alert status="accent" className="w-full">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Update available</Alert.Title>
                <Alert.Description>
                  A new version is available. Refresh to get the latest features.
                </Alert.Description>
              </Alert.Content>
            </Alert>
          ),
        },
        {
          label: 'Success',
          render: () => (
            <Alert status="success" className="w-full">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Profile updated</Alert.Title>
                <Alert.Description>Your changes have been saved successfully.</Alert.Description>
              </Alert.Content>
            </Alert>
          ),
        },
        {
          label: 'Warning',
          render: () => (
            <Alert status="warning" className="w-full">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Scheduled maintenance</Alert.Title>
                <Alert.Description>
                  Service will be down from 2:00 AM to 4:00 AM UTC.
                </Alert.Description>
              </Alert.Content>
            </Alert>
          ),
        },
        {
          label: 'Danger',
          render: () => (
            <Alert status="danger" className="w-full">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Unable to connect</Alert.Title>
                <Alert.Description>Check your internet connection and try again.</Alert.Description>
              </Alert.Content>
            </Alert>
          ),
        },
      ],
    },
    {
      title: 'Title Only',
      items: [
        {
          label: 'Compact',
          render: () => (
            <Alert status="success" className="w-full items-center">
              <Alert.Indicator className="pt-0" />
              <Alert.Content>
                <Alert.Title>Profile updated successfully</Alert.Title>
              </Alert.Content>
            </Alert>
          ),
        },
        {
          label: 'Compact danger',
          render: () => (
            <Alert status="danger" className="w-full items-center">
              <Alert.Indicator className="pt-0" />
              <Alert.Content>
                <Alert.Title>Something went wrong</Alert.Title>
              </Alert.Content>
            </Alert>
          ),
        },
      ],
    },
    {
      title: 'With Action',
      layout: 'stack',
      items: [
        {
          label: 'Accent + Refresh',
          render: () => (
            <Alert status="accent" className="w-full">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Update available</Alert.Title>
                <Alert.Description>
                  Refresh to get the latest features and bug fixes.
                </Alert.Description>
              </Alert.Content>
              <Button variant="primary" size="sm">
                <Button.Label>Refresh</Button.Label>
              </Button>
            </Alert>
          ),
        },
        {
          label: 'Danger + Retry',
          render: () => (
            <Alert status="danger" className="w-full">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Connection lost</Alert.Title>
                <Alert.Description>Unable to reach the server. Please try again.</Alert.Description>
              </Alert.Content>
              <Button variant="danger" size="sm">
                <Button.Label>Retry</Button.Label>
              </Button>
            </Alert>
          ),
        },
      ],
    },
  ],
}
