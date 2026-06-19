export interface SizeOption {
  value: string
  label: string
}

export const SIZE_OPTIONS: SizeOption[] = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
]

export const DEFAULT_SIZE = SIZE_OPTIONS[1]
