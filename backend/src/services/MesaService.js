const mesaRepository = require('../repositories/MesaRepository');

class MesaService {
    async getAll() {
        return await mesaRepository.getAll();
    }

    async create(data) {
        return await mesaRepository.create(data.numero_mesa);
    }

    async update(id, data) {
        await mesaRepository.update(id, data.numero_mesa);
    }

    async delete(id) {
        await mesaRepository.delete(id);
    }
}

module.exports = new MesaService();
