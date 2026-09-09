import express from 'express';
import "dotenv/config";
const app = express();
const port = 3000;

app.use(express.json());

// Rutas 
import userRoutes from './routes/user.routes.js';
import familyRoutes from "./routes/family.routes.js";
import { manejarErrores } from "./middlewares/error.middleware.js";

app.use("/families", familyRoutes);
app.use("/users", userRoutes);
app.use(manejarErrores);

app.get('/status', (req, res) => {
  res.send('OK!!!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
