const { Album, Artist } = require("../models");

const create = (req, res) => {
  const { artistId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      Album.create({
        name: req.body.name,
        year: req.body.year,
      }).then((album) => {
        album.setArtist(artist).then((album) => {
          res.status(201).json(album);
        });
      });
    }
  });
};

const list = (req, res) => {
  Album.findAll().then((albums) => {
    res.status(200).json(albums);
  });
};

const getAlbumsByArtistId = (req, res) => {
  const { artistId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      Album.findAll({ where: { artistId: artistId } }).then((albums) => {
        res.status(200).json(albums);
      });
    }
  });
};

const update = (req, res) => {
  const { albumId } = req.params;
  Album.update(req.body, { where: { id: albumId } }).then(
    ([numOfRowsUpdated]) => {
      if (numOfRowsUpdated === 0) {
        res.status(404).json({ error: "The album does not exist." });
      } else {
        res.status(200).json([numOfRowsUpdated]);
      }
    }
  );
};

module.exports = { create, list, getAlbumsByArtistId, update };
