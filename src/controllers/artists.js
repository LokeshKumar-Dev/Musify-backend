const { Artist } = require('../models')

const create = (req, res) => {
    Artist.create(req.body).then(artist => res.status(201).json(artist));
};

module.exports = { create };