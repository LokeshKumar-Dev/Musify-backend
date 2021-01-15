const { Artist } = require("../models");

const welcome = (req, res) => {
  res.status(200).send("Music Library API. Built by Jennifer Openshaw, January 2021. See documentation at https://github.com/jlopenshaw41/music-library-api for more info.");
};

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

const update = (req, res) => {
  const { id } = req.params;
  Artist.update(req.body, { where: { id } }).then(([numOfRowsUpdated]) => {
    if (numOfRowsUpdated === 0) {
      res.status(404).json({ error: "The artist does not exist." });
    } else {
      res.status(200).json([numOfRowsUpdated]);
    }
  });
};

const deleteArtist = (req, res) => {
  const { artistId } = req.params;
  Artist.destroy({ where: { id: artistId } }).then((numOfRowsDeleted) => {
    if (numOfRowsDeleted === 0) {
      res.status(404).json({ error: "The artist does not exist." });
    } else {
      res.status(204).json(numOfRowsDeleted);
    }
  });
};

module.exports = { create, list, getArtistById, update, deleteArtist, welcome };
