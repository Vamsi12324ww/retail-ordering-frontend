"use client"

import { useEffect, useState } from "react"

export default function AdminImages() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("https://retail-ordering-backend.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err))
  }, [])

  const filteredProducts = products.filter((product) => {
    const text = `${product.name || ""} ${product.sku || ""} ${
      product.brand || ""
    } ${product.category || ""}`.toLowerCase()

    return text.includes(search.toLowerCase())
  })

  const uploadImage = async (productId: number, file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch(
        `https://retail-ordering-backend.onrender.com/products/${productId}/image`,
        {
          method: "PUT",
          body: formData,
        }
      )

      const updated = await res.json()

      setProducts(
        products.map((p) =>
          p.id === productId ? updated : p
        )
      )

      alert("Image uploaded successfully")
    } catch (err) {
      console.log(err)
      alert("Upload failed")
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "24px",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #2563eb, #0f172a)",
          color: "white",
          borderRadius: "24px",
          padding: "30px",
          marginBottom: "24px",
          boxShadow: "0 12px 28px rgba(37, 99, 235, 0.25)",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            marginBottom: "8px",
          }}
        >
          Admin Product Images
        </h1>

        <p
          style={{
            color: "#dbeafe",
            fontSize: "16px",
          }}
        >
          Search products and upload images from the admin panel.
        </p>
      </section>

      <section
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "18px",
          marginBottom: "24px",
        }}
      >
        <input
          type="text"
          placeholder="Search by product name, SKU, brand, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            fontSize: "16px",
            color: "#0f172a",
            background: "#ffffff",
            outline: "none",
          }}
        />
      </section>

      <p
        style={{
          marginBottom: "18px",
          color: "#334155",
          fontWeight: 700,
        }}
      >
        Showing {filteredProducts.length} products
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "22px",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              background: "#ffffff",
              padding: "18px",
              borderRadius: "22px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
              color: "#0f172a",
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "190px",
                  objectFit: "contain",
                  borderRadius: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              />
            ) : (
              <div
                style={{
                  height: "190px",
                  display: "grid",
                  placeItems: "center",
                  background: "#f1f5f9",
                  borderRadius: "16px",
                  color: "#475569",
                  fontWeight: 700,
                  border: "1px solid #e2e8f0",
                }}
              >
                No Image
              </div>
            )}

            <h2
              style={{
                marginTop: "16px",
                fontSize: "20px",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {product.name || "Unnamed Product"}
            </h2>

            <p style={{ color: "#475569", marginTop: "6px" }}>
              SKU: {product.sku || "N/A"}
            </p>

            <p style={{ color: "#475569" }}>
              Brand: {product.brand || "N/A"}
            </p>

            <label
              style={{
                display: "block",
                marginTop: "14px",
                padding: "13px",
                borderRadius: "14px",
                background: "#2563eb",
                color: "white",
                fontWeight: 700,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  if (e.target.files[0]) {
                    uploadImage(product.id, e.target.files[0])
                  }
                }}
                style={{
                  display: "none",
                }}
              />
            </label>
          </div>
        ))}
      </div>
    </main>
  )
}