// api/products/image/[id].js
import fs from "fs";
import path from "path";

const IMAGES_FOLDER = path.join(process.cwd(), "src", "Images");

export default function handler(req, res) {
  const { id } = req.query;
  const imagePath = path.join(IMAGES_FOLDER, `${id}.png`); // Ajusta la extensión según tus necesidades

  try {
    const image = fs.readFileSync(imagePath, "base64");
    res.status(200).send(`data:image/png;base64,${image}`);
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
    return res.status(500).json({ message: "Error al cargar la imagen" });
  }
}
