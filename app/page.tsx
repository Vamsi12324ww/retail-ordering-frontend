"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { addToCart } from "@/lib/cart"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [distributor, setDistributor] = useState("all")

  useEffect(() => {
    fetch("https://retail-ordering-backend.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err))
  }, [])

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
  const distributors = Array.from(new Set(products.map((p) => p.distributor).filter(Boolean)))

  const filteredProducts = products.filter((product) => {
    const text = `${product.name} ${product.sku} ${product.brand}`.toLowerCase()

    return (
      text.includes(search.toLowerCase()) &&
      (category === "all" || product.category === category) &&
      (distributor === "all" || product.distributor === distributor)
    )
  })

  return (
    <main style={{ background: "#ffffff", minHeight: "100vh", padding: "20px" }}>
      <section
        style={{
          background: "linear-gradient(135deg, #2563eb, #0f172a)",
          color: "white",
          borderRadius: "24px",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "34px", fontWeight: 800 }}>Retail Order Builder</h1>
        <p style={{ color: "#dbeafe", marginTop: "8px" }}>
          Search products, add items to cart, and generate distributor order PDFs.
        </p>

        <Link href="/cart">
          <button
            style={{
              marginTop: "20px",
              width: "100%",
              background: "white",
              color: "#0f172a",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            View Cart
          </button>
        </Link>
      </section>

      <section
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "18px",
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        <input
          placeholder="Search by name, SKU, or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "15px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            color: "#0f172a",
            background: "white",
            fontSize: "15px",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "15px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            color: "#0f172a",
            background: "white",
            fontSize: "15px",
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={distributor}
          onChange={(e) => setDistributor(e.target.value)}
          style={{
            padding: "15px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            color: "#0f172a",
            background: "white",
            fontSize: "15px",
          }}
        >
          <option value="all">All Distributors</option>
          {distributors.map((dist: any) => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
      </section>

      <p style={{ marginBottom: "18px", color: "#334155", fontWeight: 600 }}>
        Showing {filteredProducts.length} products
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "22px",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              background: "#ffffff",
              borderRadius: "22px",
              padding: "18px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  borderRadius: "16px",
                  background: "#f8fafc",
                }}
              />
            ) : (
              <div
                style={{
                  height: "180px",
                  background: "#f1f5f9",
                  color: "#64748b",
                  borderRadius: "16px",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 600,
                }}
              >
                No Image
              </div>
            )}

            <h2 style={{ fontSize: "21px", marginTop: "16px", color: "#0f172a" }}>
              {product.name}
            </h2>

            <p style={{ color: "#475569" }}>SKU: {product.sku}</p>
            <p style={{ color: "#475569" }}>Brand: {product.brand || "N/A"}</p>
            <p style={{ color: "#475569" }}>Category: {product.category || "N/A"}</p>
            <p style={{ color: "#475569" }}>
              Distributor: {product.distributor || "N/A"}
            </p>

            <button
              onClick={() => addToCart(product)}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                background: "#2563eb",
                color: "white",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}