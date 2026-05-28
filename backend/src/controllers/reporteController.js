const Reporte = require('../models/reporteModel');

const getVentasDelDia = async (req, res) => {
    try {
        const reporte = await Reporte.getVentasDelDia();
        res.json(reporte);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error obteniendo reporte' });
    }
};

module.exports = { getVentasDelDia };
