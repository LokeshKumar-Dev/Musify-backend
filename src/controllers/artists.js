const { Artist } = require('../models')

const create = (req, res) => {
    Artist.create(req.body).then(artist => res.status(201).json(artist));
};

const list = (req, res) => {
    Artist.findAll().then((artists) => res.status(200).json(artists));
};

module.exports = { create, list };