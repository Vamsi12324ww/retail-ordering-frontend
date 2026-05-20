"use client"

import { useState } from "react"
import axios from "axios"

export default function AddProduct() {
  const [form, setForm] = useState({
    sku: "",
    name: "",
    price: "",
    stock: "",
  })

  const [image, setImage] = useState<File | null>(null)

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append("sku", form.sku)
      formData.append("name", form.name)
      formData.append("price", form.price)
      formData.append("stock", form.stock)

      if (image) {
        formData.append("image", image)
      }

      const res = await axios.post(
  "https://retail-ordering-backend.onrender.com/products",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
)

      console.log(res.data)

      alert("Product added successfully 🚀")
    } catch (err) {
      console.log(err)
      alert("Error adding product")
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Product</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="file"
          onChange={(e: any) => setImage(e.target.files[0])}
        />
        <br /><br />

        <button type="submit">
          Add Product
        </button>
      </form>
    </div>
  )
}