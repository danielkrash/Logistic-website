import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

/**
 * Converts a UTC date string to local timezone and formats it
 * @param utcDateString - ISO 8601 UTC date string from backend
 * @param formatString - date-fns format string (optional)
 * @returns Formatted date string in user's local timezone
 */
export function formatDateInUserTimezone(
  utcDateString: string | null | undefined,
  formatString: string = 'PPP p', // "Jan 1, 2025 at 2:30 PM"
): string {
  if (!utcDateString) {
    return 'Not set'
  }

  try {
    // Parse the UTC date string
    const utcDate = parseISO(utcDateString)

    // Check if the date is valid
    if (!isValid(utcDate)) {
      return 'Invalid date'
    }

    // Format in user's local timezone
    return format(utcDate, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Formats a date as a short format (MMM dd, yyyy)
 */
export function formatDateShort(utcDateString: string | null | undefined): string {
  return formatDateInUserTimezone(utcDateString, 'MMM dd, yyyy')
}

/**
 * Formats a date with time (MMM dd, yyyy 'at' h:mm a)
 */
export function formatDateWithTime(utcDateString: string | null | undefined): string {
  return formatDateInUserTimezone(utcDateString, "MMM dd, yyyy 'at' h:mm a")
}

/**
 * Formats a date as relative time (e.g., "in 2 days", "3 hours ago")
 */
export function formatDateRelative(utcDateString: string | null | undefined): string {
  if (!utcDateString) {
    return 'Not set'
  }

  try {
    const utcDate = parseISO(utcDateString)

    if (!isValid(utcDate)) {
      return 'Invalid date'
    }

    return formatDistanceToNow(utcDate, { addSuffix: true })
  } catch (error) {
    console.error('Error formatting relative date:', error)
    return 'Invalid date'
  }
}

/**
 * Formats delivery date specifically for package displays
 */
export function formatDeliveryDate(utcDateString: string | null | undefined): string {
  if (!utcDateString) {
    return 'Not scheduled'
  }

  const formattedDate = formatDateWithTime(utcDateString)
  const relativeTime = formatDateRelative(utcDateString)

  return `${formattedDate} (${relativeTime})`
}

/**
 * Creates a Date object from user input that maintains local timezone context
 * This is useful when users are selecting dates in their local timezone
 * but we need to send them as UTC to the backend
 * @param localDate - Date selected by user in their timezone
 * @returns Date object that can be converted to UTC with toISOString()
 */
export function createLocalDate(localDate: Date): Date {
  // The date is already in the user's timezone, we just return it
  // When we call toISOString() later, it will properly convert to UTC
  return localDate
}

/**
 * Gets the user's timezone identifier
 * @returns User's timezone (e.g., "America/New_York", "Europe/London")
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    console.error('Error getting user timezone:', error)
    return 'UTC'
  }
}

/**
 * Example usage for debugging timezone conversions
 */
export function debugTimezoneConversion(localDate: Date): void {
  console.log('=== Timezone Conversion Debug ===')
  console.log('Local Date Input:', localDate.toString())
  console.log('User Timezone:', getUserTimezone())
  console.log('UTC ISO String (sent to backend):', localDate.toISOString())
  console.log('Local ISO String:', localDate.toLocaleString())
  console.log('================================')
}
