'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  placeholder?: string
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Pick a date and time',
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [time, setTime] = React.useState(() => {
    if (value) {
      return format(value, 'HH:mm')
    }
    return '09:00'
  })

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Combine the selected date with the current time
      const [hours, minutes] = time.split(':').map(Number)
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(hours ?? 9, minutes ?? 0, 0, 0)
      onChange?.(newDateTime)
    } else {
      onChange?.(undefined)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (value) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDateTime = new Date(value)
      newDateTime.setHours(hours ?? 9, minutes ?? 0, 0, 0)
      onChange?.(newDateTime)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : placeholder}
            <ClockIcon className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={disabled}
            initialFocus
          />
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <Input
                type="time"
                value={time}
                onChange={e => handleTimeChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {value && (
        <div className="text-sm text-muted-foreground">Selected: {format(value, "PPP 'at' p")}</div>
      )}
    </div>
  )
}
