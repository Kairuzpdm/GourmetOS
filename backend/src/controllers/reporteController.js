const reporteService = require('../services/ReporteService');

const getVentasDelDia = async (req, res, next) => {
    try {
        const ventas = await reporteService.getVentasDelDia();
        res.json(ventas);
    } catch (error) {
        next(error);
    }
};

module.exports = { getVentasDelDia };
