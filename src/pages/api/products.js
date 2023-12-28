import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

let products = [
  {
    id: uuidv4(),
    name: "Monitor",
    description: "Monitor 24 pulgadas",
    price: 200,
    photo: "",
  },
  {
    id: uuidv4(),
    name: "Teclado",
    description: "Teclado mecánico",
    price: 100,
    photo: "",
  },
  {
    id: uuidv4(),
    name: "Mouse",
    description: "Mouse gamer",
    price: 50,
    photo: "",
  },
];
const IMAGES_FOLDER = path.join(process.cwd(), "src", "Images");

export default function handler(req, res) {
  if (req.method === "GET") {
    return getProducts(req, res);
  } else if (req.method === "POST") {
    return addProduct(req, res);
  } else if (req.method === "PUT") {
    return updateProduct(req, res);
  } else if (req.method === "DELETE") {
    return deleteProduct(req, res);
  }
}

function getProducts(req, res) {
  res.status(200).json(products);
}

function addProduct(req, res) {
  const { name, description, price, photo } = req.body;

  const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
  const extension = photo.split(";")[0].split("/")[1];
  const filePath = path.join(IMAGES_FOLDER, `${uuidv4()}.${extension}`);

  try {
    fs.writeFileSync(filePath, base64Data, "base64");
    const imageUrl = `/${path.relative(process.cwd(), filePath)}`;

    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      photo: imageUrl,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al guardar la imagen:", error);
    return res.status(500).json({ message: "Error al guardar la imagen" });
  }
}

function updateProduct(req, res) {
  const { id, name, description, price } = req.body;
  let { photo } = req.body;

  const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
  const extension = photo.split(";")[0].split("/")[1];
  const filePath = path.join(IMAGES_FOLDER, `${uuidv4()}.${extension}`);

  try {
    fs.writeFileSync(filePath, base64Data, "base64");
    photo = `/${path.relative(process.cwd(), filePath)}`;
  } catch (error) {
    console.error("Error al guardar la imagen:", error);
    return res.status(500).json({ message: "Error al guardar la imagen" });
  }

  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[productIndex] = {
    id,
    name,
    description,
    price,
    photo,
  };
  res.status(200).json(products[productIndex]);
}

function deleteProduct(req, res) {
  const { id } = req.query;
  products = products.filter((p) => p.id !== id);
  res.status(200).json({ message: "Product deleted" });
}
