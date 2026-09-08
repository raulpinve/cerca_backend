import express from 'express';
import "dotenv/config";

const app = express();
const port = 3000;

// Rutas 
import userRoutes from './routes/user.routes.js';
app.use("/users", userRoutes);

app.get('/status', (req, res) => {
  res.send('OK!!!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
