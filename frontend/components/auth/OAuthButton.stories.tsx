import OAuthButton from '@/components/auth/OAuthButton'
import type { ComponentStory } from '@/components/dev/storyTypes'

export const oAuthButtonStories: ComponentStory = {
  componentName: 'OAuthButton',
  description: 'OAuth sign-in buttons for Google, X, and Apple. Loading and disabled states.',
  groups: [
    {
      title: 'Providers',
      layout: 'stack',
      items: [
        {
          label: 'Google',
          render: () => <OAuthButton provider="google" onPress={() => {}} loading={false} />,
        },
        {
          label: 'X',
          render: () => <OAuthButton provider="x" onPress={() => {}} loading={false} />,
        },
        {
          label: 'Apple',
          render: () => <OAuthButton provider="apple" onPress={() => {}} loading={false} />,
        },
      ],
    },
    {
      title: 'States',
      layout: 'stack',
      items: [
        {
          label: 'Loading (Google)',
          render: () => <OAuthButton provider="google" onPress={() => {}} loading />,
        },
        {
          label: 'Disabled (Apple)',
          render: () => (
            <OAuthButton provider="apple" onPress={() => {}} loading={false} disabled />
          ),
        },
      ],
    },
  ],
}
