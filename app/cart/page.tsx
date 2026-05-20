"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { getCart, saveCart, CartItem } from "@/lib/cart"

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [storeName, setStoreName] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")

  useEffect(() => {
    setCart(getCart())
  }, [])

  const updateCart = (updated: CartItem[]) => {
    setCart(updated)
    saveCart(updated)
  }

  const increaseQty = (id: number) => {
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQty = (id: number) => {
    updateCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    updateCart(cart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    updateCart([])
  }

  const groupedCart = cart.reduce((groups: any, item) => {
    const distributor = item.distributor || "Default Distributor"
    if (!groups[distributor]) groups[distributor] = []
    groups[distributor].push(item)
    return groups
  }, {})

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const downloadPDF = () => {
    const doc = new jsPDF()
    const today = new Date().toLocaleDateString()

    doc.setFontSize(20)
    doc.text("Retail Store Order Request", 14, 18)

    doc.setFontSize(11)
    doc.text(`Store: ${storeName || "N/A"}`, 14, 26)
    doc.text(`Owner Email: ${ownerEmail || "N/A"}`, 14, 33)
    doc.text(`Date: ${today}`, 14, 40)
    doc.text(`Total Items: ${totalItems}`, 14, 47)

    let y = 57

    Object.keys(groupedCart).forEach((distributor) => {
      doc.setFontSize(14)
      doc.text(`Distributor: ${distributor}`, 14, y)

      autoTable(doc, {
        startY: y + 5,
        head: [["SKU", "Product", "Qty"]],
        body: groupedCart[distributor].map((item: CartItem) => [
          item.sku,
          item.name,
          item.quantity,
        ]),
      })

      y = (doc as any).lastAutoTable.finalY + 15
    })

    doc.save("retail-order-request.pdf")
  }

  return (
    <main style={{ background: "#ffffff", minHeight: "100vh", padding: "32px" }}>
      <section
        style={{
          background: "linear-gradient(135deg, #16a34a, #0f172a)",
          color: "white",
          borderRadius: "24px",
          padding: "30px",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 12px 30px rgba(22, 163, 74, 0.25)",
        }}
      >
        <div>
          <h1 style={{ fontSize: "36px", fontWeight: 800 }}>Order Cart</h1>
          <p style={{ color: "#dcfce7", marginTop: "6px" }}>
            Review quantities and download the distributor order PDF.
          </p>
        </div>

        <Link href="/">
          <button
            style={{
              background: "white",
              color: "#0f172a",
              padding: "13px 20px",
              borderRadius: "14px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to Products
          </button>
        </Link>
      </section>

      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <input
          type="text"
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            fontSize: "16px",
            color: "#0f172a",
            background: "white",
          }}
        />

        <input
          type="email"
          placeholder="Owner Email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            fontSize: "16px",
            color: "#0f172a",
            background: "white",
          }}
        />
      </div>

      {cart.length === 0 ? (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            color: "#334155",
          }}
        >
          <h2>Your cart is empty</h2>
          <p>Add products from the catalog to generate an order PDF.</p>
        </div>
      ) : (
        <>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong style={{ color: "#0f172a", fontSize: "18px" }}>
              Total Quantity: {totalItems}
            </strong>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={downloadPDF}
                style={{
                  padding: "13px 18px",
                  borderRadius: "14px",
                  border: "none",
                  background: "#16a34a",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Download PDF
              </button>

              <button
                onClick={clearCart}
                style={{
                  padding: "13px 18px",
                  borderRadius: "14px",
                  border: "1px solid #fecaca",
                  background: "#fff1f2",
                  color: "#be123c",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {Object.keys(groupedCart).map((distributor) => (
            <section key={distributor} style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  color: "#0f172a",
                  fontSize: "24px",
                  marginBottom: "14px",
                }}
              >
                {distributor}
              </h2>

              <div style={{ display: "grid", gap: "14px" }}>
                {groupedCart[distributor].map((item: CartItem) => (
                  <div
                    key={item.id}
                    style={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      padding: "18px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: "16px",
                      alignItems: "center",
                      boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <div>
                      <h3 style={{ color: "#0f172a", fontSize: "20px" }}>
                        {item.name}
                      </h3>
                      <p style={{ color: "#64748b" }}>SKU: {item.sku}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#f8fafc",
                        padding: "8px",
                        borderRadius: "14px",
                      }}
                    >
                      <button
                        onClick={() => decreaseQty(item.id)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "10px",
                          border: "none",
                          background: "#e2e8f0",
                          cursor: "pointer",
                        }}
                      >
                        -
                      </button>

                      <strong
                        style={{
                          color: "#0f172a",
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </strong>

                      <button
                        onClick={() => increaseQty(item.id)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "10px",
                          border: "none",
                          background: "#2563eb",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                        color: "#be123c",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  )
}