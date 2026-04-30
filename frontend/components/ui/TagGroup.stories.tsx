import type { ComponentStory } from '@/components/dev/storyTypes'
import { TagGroup } from '@/components/ui'

export const tagGroupStories: ComponentStory = {
  componentName: 'TagGroup',
  description: 'Brand-baked TagGroup with items, removable tags.',
  groups: [
    {
      title: 'With Items',
      items: [
        {
          label: 'Basic tags',
          render: () => (
            <TagGroup animation="disable-all">
              <TagGroup.List>
                <TagGroup.Item id="design">
                  <TagGroup.ItemLabel>Design</TagGroup.ItemLabel>
                </TagGroup.Item>
                <TagGroup.Item id="dev">
                  <TagGroup.ItemLabel>Dev</TagGroup.ItemLabel>
                </TagGroup.Item>
                <TagGroup.Item id="marketing">
                  <TagGroup.ItemLabel>Marketing</TagGroup.ItemLabel>
                </TagGroup.Item>
              </TagGroup.List>
            </TagGroup>
          ),
        },
        {
          label: 'Removable',
          render: () => (
            <TagGroup animation="disable-all">
              <TagGroup.List>
                <TagGroup.Item id="react">
                  <TagGroup.ItemLabel>React</TagGroup.ItemLabel>
                  <TagGroup.ItemRemoveButton />
                </TagGroup.Item>
                <TagGroup.Item id="typescript">
                  <TagGroup.ItemLabel>TypeScript</TagGroup.ItemLabel>
                  <TagGroup.ItemRemoveButton />
                </TagGroup.Item>
                <TagGroup.Item id="tailwind">
                  <TagGroup.ItemLabel>Tailwind</TagGroup.ItemLabel>
                  <TagGroup.ItemRemoveButton />
                </TagGroup.Item>
              </TagGroup.List>
            </TagGroup>
          ),
        },
      ],
    },
  ],
}
