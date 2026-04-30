import { useState } from 'react'
import { View } from 'react-native'
import type { ComponentStory } from '@/components/dev/storyTypes'
import { Button, Dialog } from '@/components/ui'

export const dialogStories: ComponentStory = {
  componentName: 'Dialog',
  description:
    'Brand-baked Dialog with compound parts (Portal, Overlay, Content, Title, Description, Close).',
  groups: [
    {
      title: 'Open State',
      layout: 'stack',
      items: [
        {
          label: 'Basic dialog',
          render: () => <BasicDialog />,
        },
        {
          label: 'With actions',
          render: () => <ActionDialog />,
        },
      ],
    },
  ],
}

function BasicDialog() {
  const [open, setOpen] = useState(true)
  return (
    <Dialog isOpen={open} onOpenChange={setOpen} animation="disable-all">
      <Dialog.Trigger asChild>
        <Button variant="primary">
          <Button.Label>Open Dialog</Button.Label>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Close variant="ghost" />
          <View className="mb-5 gap-1.5">
            <Dialog.Title>Confirm Action</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to proceed with this action? This cannot be undone.
            </Dialog.Description>
          </View>
          <View className="flex-row justify-end gap-3">
            <Button variant="ghost" size="sm" onPress={() => setOpen(false)}>
              <Button.Label>Cancel</Button.Label>
            </Button>
            <Button size="sm">
              <Button.Label>Confirm</Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

function ActionDialog() {
  const [open, setOpen] = useState(true)
  return (
    <Dialog isOpen={open} onOpenChange={setOpen} animation="disable-all">
      <Dialog.Trigger asChild>
        <Button variant="secondary">
          <Button.Label>Delete Item</Button.Label>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Close variant="ghost" />
          <View className="mb-5 gap-1.5">
            <Dialog.Title>Delete item</Dialog.Title>
            <Dialog.Description>
              This action is permanent and cannot be reversed.
            </Dialog.Description>
          </View>
          <View className="flex-row justify-end gap-3">
            <Button variant="ghost" size="sm" onPress={() => setOpen(false)}>
              <Button.Label>Keep</Button.Label>
            </Button>
            <Button variant="danger" size="sm">
              <Button.Label>Delete</Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
