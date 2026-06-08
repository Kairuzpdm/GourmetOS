const categoriaRepository = require('../repositories/CategoriaRepository');

class CategoriaService {
    async getAll() {
        return await categoriaRepository.getAll();
    }

    async create(data) {
        return await categoriaRepository.create(data.nombre, data.descripcion);
    }

    async update(id, data) {
        await categoriaRepository.update(id, data.nombre, data.descripcion);
    }

    async delete(id) {
        await categoriaRepository.delete(id);
    }
}

module.exports = new CategoriaService();
