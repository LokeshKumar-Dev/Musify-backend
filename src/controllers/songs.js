const { Album, Artist, Song } = require("../models");

const create = (req, res) => {
  const { artistId, albumId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      Album.findByPk(albumId).then((album) => {
        if (!album) {
          res.status(404).json({ error: "The album could not be found." });
        } else {
          Song.create({
            name: req.body.name,
            year: req.body.year,
            artistId: artistId,
            albumId: albumId,
          }).then((song) => {
            res.status(201).json(song);
          });
        }
      });
    }
  });
};

const list = (req, res) => {
  Song.findAll().then((songs) => {
    res.status(200).json(songs);
  });
};

module.exports = { create, list };
