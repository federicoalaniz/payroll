export function formatCUITCUIL(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '')
  
  // Limit to 11 digits
  const truncated = numbers.slice(0, 11)
  
  // Apply XX-XXXXXXXX-X format
  if (truncated.length <= 2) {
    return truncated
  } else if (truncated.length <= 10) {
    return `${truncated.slice(0, 2)}-${truncated.slice(2)}`
  } else {
    return `${truncated.slice(0, 2)}-${truncated.slice(2, 10)}-${truncated.slice(10)}`
  }
}

export function validateCUITCUIL(value: string): boolean {
  // Check if the value matches the pattern XX-XXXXXXXX-X
  return /^\d{2}-\d{8}-\d{1}$/.test(value)
}