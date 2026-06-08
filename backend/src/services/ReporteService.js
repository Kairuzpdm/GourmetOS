const reporteRepository = require('../repositories/ReporteRepository');

class ReporteService {
    async getVentasDelDia() {
        return await reporteRepository.getVentasDelDia();
    }
}

module.exports = new ReporteService();
