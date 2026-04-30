import type { ComponentStory } from '@/components/dev/storyTypes'
import { Select } from '@/components/ui'

export const selectStories: ComponentStory = {
  componentName: 'Select',
  description: 'Brand-baked Select with compound parts. Single and multiple selection.',
  groups: [
    {
      title: 'Single Selection',
      items: [
        {
          label: 'Closed',
          render: () => (
            <Select className="w-60" animation="disable-all">
              <Select.Trigger>
                <Select.Value placeholder="Choose a fruit" />
              </Select.Trigger>
            </Select>
          ),
        },
        {
          label: 'With items',
          render: () => (
            <Select className="w-60" animation="disable-all">
              <Select.Trigger>
                <Select.Value placeholder="Choose a fruit" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="dialog">
                  <Select.Item label="Apple" value="apple" />
                  <Select.Item label="Banana" value="banana" />
                  <Select.Item label="Cherry" value="cherry" />
                </Select.Content>
              </Select.Portal>
            </Select>
          ),
        },
      ],
    },
    {
      title: 'Multiple Selection',
      items: [
        {
          label: 'Multi select',
          render: () => (
            <Select selectionMode="multiple" className="w-60" animation="disable-all">
              <Select.Trigger>
                <Select.Value placeholder="Choose tags" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="dialog">
                  <Select.Item label="Design" value="design" />
                  <Select.Item label="Development" value="dev" />
                  <Select.Item label="Marketing" value="marketing" />
                  <Select.Item label="Sales" value="sales" />
                </Select.Content>
              </Select.Portal>
            </Select>
          ),
        },
      ],
    },
  ],
}
