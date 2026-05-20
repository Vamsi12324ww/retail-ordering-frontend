"use client"

export type CartItem = {
  id: number
  sku: string
  name: string
  price: number
  imageUrl?: string | null
  distributor?: string | null
  quantity: number
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []

  return JSON.parse(localStorage.getItem("cart") || "[]")
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart))
}

export function addToCart(product: any, quantity = 1) {
  const cart = getCart()

  const existing = cart.find(
    (item) => item.id === product.id
  )

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      distributor: product.distributor || "Default Distributor",
      quantity,
    })
  }

  saveCart(cart)
}