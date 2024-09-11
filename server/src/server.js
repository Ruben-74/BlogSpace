import "dotenv/config";
import router from "./router/index.router.js";
import express from "express";
import cors from "cors";
const app = express();

const PORT = process.env.PORT || process.env.LOCAL_PORT;

// Configurer CORS
app.use(cors());

// envoi de reponses json
app.use(express.json());

//Formulaires
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`));
