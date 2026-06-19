export interface ApiProduct {
  id: number
  name: string
  price: number
  discount: number
  description: string
  category?: string
  colors?: string[]
  color?: string
  images?: string[]
  image?: string
  in_stock?: boolean
  stock_count?: number
  sales?: number
}

export interface ApiAdminLoginResponse {
  token: string
  admin: {
    id: number
    name: string
    email: string
    role: string
  }
}

export interface ApiOrderItem {
  product_id: number
  name: string
  color: string
  size: string
  quantity: number
  unit_price: number
}

export interface ApiOrderPayload {
  email: string
  phone: string
  firstname: string
  lastname: string
  address: string
  city: string
  payment_method: string
  Order_Notes?: string
  items: ApiOrderItem[]
}

export interface ApiOrderResponse {
  success: string
}

export interface ApiOrder {
  id: number
  email: string
  phone: string
  firstname: string
  lastname: string
  address: string
  city: string
  payment_method: string
  order_notes: string
  created_at: string
  items: ApiOrderItem[]
  total: number
  item_count: number
}
