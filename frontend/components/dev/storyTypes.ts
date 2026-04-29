import type { ReactNode } from 'react'

export interface StoryItem {
  label: string
  render: () => ReactNode
}

export interface StoryGroup {
  title: string
  items: StoryItem[]
}

export interface ComponentStory {
  componentName: string
  description?: string
  groups: StoryGroup[]
}
