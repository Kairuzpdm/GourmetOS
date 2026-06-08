require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const mesaRoutes = require('./src/routes/mesaRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const reporteRoutes = require('./src/routes/reporteRoutes');

app.use('/auth', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/productos', productoRoutes);
app.use('/mesas', mesaRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/reportes', reporteRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del Restaurante' });
});

// Global error handler
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
