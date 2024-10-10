import multer from "multer";
import path from "path";

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Dossier de destination
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Conserver le nom d'origine
  },
});

// Créer l'instance de multer avec la configuration
const upload = multer({ storage });

// Exporter le middleware pour l'utiliser dans les routes
export const uploadImage = upload.single("image");
