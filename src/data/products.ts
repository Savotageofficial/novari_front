export const PRODUCT_PLACEHOLDER_IMAGE = '/assets/T-shirt placeholder.webp'

export interface Product {
  id: string
  name: string
  numericPrice: number
  discount: number
  description: string
  images: string[]
  category: string
  colors: string[]
}

export function formatPrice(value: number): string {
  return `${Math.round(value).toLocaleString('en-EG')} EGP`
}

export function getEffectivePrice(product: Product): number {
  return Math.round(product.numericPrice * (1 - product.discount / 100))
}

export function getPrimaryImage(product: Product): string {
  return product.images[0] ?? PRODUCT_PLACEHOLDER_IMAGE
}
