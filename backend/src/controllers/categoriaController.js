const Categoria = require('../models/categoriaModel');

const getAll = async (req, res) => {
    try {
        const categorias = await Categoria.getAll();
        res.json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo categorías' });
    }
};

const create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const id = await Categoria.create(nombre, descripcion);
        res.status(201).json({ id, nombre, descripcion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando categoría' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        await Categoria.update(id, nombre, descripcion);
        res.json({ message: 'Categoría actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando categoría' });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await Categoria.delete(id);
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando categoría' });
    }
};

module.exports = { getAll, create, update, remove };
