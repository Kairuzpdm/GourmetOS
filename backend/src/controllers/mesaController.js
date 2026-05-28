const Mesa = require('../models/mesaModel');

const getAll = async (req, res) => {
    try {
        const mesas = await Mesa.getAll();
        res.json(mesas);
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Error obteniendo mesas'});
    }
};

module.exports = { getAll };
