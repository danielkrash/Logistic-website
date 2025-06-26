'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { components } from '@/types/schemav3'
import { UpdatePosition, DeletePosition } from '@/lib/position_actions'
import { toast } from '@/components/ui/use-toast'

type PositionDto = components['schemas']['PositionDto']

interface PositionTableActionsProps {
  data: PositionDto
}

export function PositionTableActions({ data }: PositionTableActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: data.type || '',
    description: data.description || '',
  })

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditLoading(true)

    const form = new FormData()
    form.append('id', data.id?.toString() || '')
    form.append('type', formData.type)
    form.append('description', formData.description)

    try {
      const result = await UpdatePosition(form)

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Position updated successfully',
        })
        setIsEditOpen(false)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update position',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!data.id) return

    setIsDeleteLoading(true)

    try {
      const result = await DeletePosition(data.id)

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Position deleted successfully',
        })
        setIsDeleteOpen(false)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete position',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <div className="flex space-x-2">
      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isEditLoading || isDeleteLoading}>
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Position</DialogTitle>
              <DialogDescription>
                Make changes to the position details here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="col-span-3"
                  required
                  disabled={isEditLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                  disabled={isEditLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isEditLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEditLoading}>
                {isEditLoading ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isEditLoading || isDeleteLoading}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Position</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the position &quot;{data.type}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleteLoading}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleteLoading}>
              {isDeleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
