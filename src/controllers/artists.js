const { Artist } = require("../models");

const create = (req, res) => {
  Artist.create(req.body).then((artist) => res.status(201).json(artist));
};

const list = (req, res) => {
  Artist.findAll().then((artists) => res.status(200).json(artists));
};

const getArtistById = (req, res) => {
  const { artistId } = req.params;
  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      res.status(200).json(artist);
    }
  });
};

const updateGenre = (req, res) => {
  const { id } = req.params;
  Artist.update(req.body, { where: { id } }).then(([numOfRowsUpdated]) => {
    res.status(200).json([numOfRowsUpdated]);
  });
};

module.exports = { create, list, getArtistById, updateGenre };
