const productoRepository = require('../repositories/ProductoRepository');

class ProductoService {
    async getAll() {
        return await productoRepository.getAll();
    }

    async create(data) {
        return await productoRepository.create(data);
    }

    async update(id, data) {
        await productoRepository.update(id, data);
    }

    async delete(id) {
        await productoRepository.delete(id);
    }
}

module.exports = new ProductoService();
