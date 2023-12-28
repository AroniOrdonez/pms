import React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(
        typeof editingProduct.price === "string" &&
          editingProduct.price.startsWith("S/")
          ? editingProduct.price
          : `S/${editingProduct.price}`
      );
      setPhoto(editingProduct.photo);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setPhoto("");
    }
  }, [editingProduct]);

  const handlePriceChange = (value) => {
    const numericValue = value.replace(/\D/g, "");
    setPrice(numericValue ? `S/${numericValue}` : "");
  };

  const getProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const validateFields = () => {
    return (
      name.trim() !== "" && description.trim() !== "" && price.trim() !== ""
    );
  };

  const addProduct = async () => {
    if (!validateFields()) {
      return Swal.fire(
        "Error",
        "Por favor, complete todos los campos.",
        "error"
      );
    }

    if (photo && photo.includes("data:image/jpeg;base64,")) {
      const base64Image = photo.split(",")[1];

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, price, photo: base64Image }),
      });

      if (res.ok) {
        await getProducts();
        Swal.fire(
          "¡Producto agregado!",
          "El producto se agregó correctamente.",
          "success"
        );
      } else {
        Swal.fire("Error", "Hubo un error al agregar el producto.", "error");
      }
    } else {
      console.error("La imagen no tiene el formato base64 esperado.");
      return;
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await getProducts();
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
      } else {
        Swal.fire("Error", "Hubo un error al eliminar el producto.", "error");
      }
    }
  };

  const updateProduct = async () => {
    if (!validateFields()) {
      return Swal.fire(
        "Error",
        "Por favor, complete todos los campos.",
        "error"
      );
    }

    const res = await fetch(`/api/products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingProduct.id,
        name,
        description,
        price,
        photo,
      }),
    });

    if (res.ok) {
      setEditingProduct(null);
      await getProducts();
      Swal.fire(
        "¡Actualizado!",
        "El producto se actualizó correctamente.",
        "success"
      );
    } else {
      Swal.fire("Error", "Hubo un error al actualizar el producto.", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Productos</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Precio"
          value={price.replace("S/", "")}
          onChange={(e) => handlePriceChange(e.target.value)}
          disabled={!!editingProduct}
          type="text"
        />
        <input
          className="border p-2 mr-2"
          type="file"
          onChange={handleImageChange}
        />
        {photo && <img src={photo} alt="Preview" width="50" className="mt-2" />}
        <button className="bg-blue-500 text-white p-2" onClick={addProduct}>
          Agregar
        </button>
      </div>

      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Imagen</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <React.Fragment key={product.id}>
              {editingProduct && editingProduct.id === product.id ? (
                <tr>
                  <td className="border p-2">
                    <input
                      className="border p-2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="border p-2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="border p-2"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    {editingProduct.photo && (
                      <img
                        src={editingProduct.photo}
                        alt="Product"
                        width="50"
                        className="mt-2"
                      />
                    )}
                    <input
                      className="border p-2 mr-2"
                      type="file"
                      onChange={handleImageChange}
                      name="photo"
                    />
                    {photo && (
                      <img
                        src={photo}
                        alt="Preview"
                        width="50"
                        className="mt-2"
                      />
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-green-500 text-white p-2"
                      onClick={updateProduct}
                    >
                      Actualizar
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 ml-2"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancelar Edición
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={product.id}>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.description}</td>
                  <td className="border p-2">{product.price}</td>
                  <td className="border p-2">
                    <img
                      src={product.photo}
                      alt="Product"
                      width="50"
                      className="mt-2"
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-yellow-500 text-white p-2"
                      onClick={() => setEditingProduct(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 ml-2"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
