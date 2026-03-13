'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FieldGroup, FieldLabel } from '@/components/ui/field'

interface CreateRoomDialogProps {
  onCreateRoom?: (room: {
    name: string
    description: string
    isPrivate: boolean
  }) => void
}

export function CreateRoomDialog({ onCreateRoom }: CreateRoomDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
  })

  const handleCreate = () => {
    if (formData.name.trim()) {
      onCreateRoom?.(formData)
      setFormData({ name: '', description: '', isPrivate: false })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="size-5" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-border">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Set up a new collaborative canvas room for your team
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <FieldGroup>
            <FieldLabel htmlFor="room-name">Room Name</FieldLabel>
            <Input
              id="room-name"
              placeholder="e.g., Q1 Marketing Designs"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border-border"
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="room-description">Description</FieldLabel>
            <Textarea
              id="room-description"
              placeholder="Describe what this room is for..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border-border resize-none"
              rows={4}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Visibility</FieldLabel>
            <RadioGroup
              value={formData.isPrivate ? 'private' : 'public'}
              onValueChange={(val) =>
                setFormData({ ...formData, isPrivate: val === 'private' })
              }
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex-1 cursor-pointer">
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-muted-foreground">
                    Anyone in your workspace can access
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex-1 cursor-pointer">
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-muted-foreground">
                    Only invited members can access
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </FieldGroup>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!formData.name.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Create Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
