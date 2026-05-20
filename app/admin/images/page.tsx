"use client"

import { useEffect, useState } from "react"

export default function AdminImages() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetch("https://retail-ordering-backend.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  const uploadImage = async (
    productId: number,
    file: File
  ) => {
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

      alert("Image uploaded successfully 🚀")
    } catch (err) {
      console.log(err)
      alert("Upload failed")
    }
  }

  return (
    <main
      style={{
        padding: "20px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 800,
          marginBottom: "24px",
        }}
      >
        Admin Product Images
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: "white",
              padding: "18px",
              borderRadius: "18px",
              border: "1px solid #e2e8f0",
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
                  borderRadius: "14px",
                  background: "#f8fafc",
                }}
              />
            ) : (
              <div
                style={{
                  height: "180px",
                  display: "grid",
                  placeItems: "center",
                  background: "#f1f5f9",
                  borderRadius: "14px",
                  color: "#64748b",
                }}
              >
                No Image
              </div>
            )}

            <h2
              style={{
                marginTop: "14px",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              {product.name}
            </h2>

            <p>SKU: {product.sku}</p>

            <input
              type="file"
              accept="image/*"
              onChange={(e: any) => {
                if (e.target.files[0]) {
                  uploadImage(
                    product.id,
                    e.target.files[0]
                  )
                }
              }}
              style={{
                marginTop: "14px",
              }}
            />
          </div>
        ))}
      </div>
    </main>
  )
}