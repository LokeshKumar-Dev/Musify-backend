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
  Album.findAll({
    include: [
      {
        model: Artist,
        as: "artist",
      },
    ],
  }).then((albums) => {
    res.status(200).json(albums);
  });
};

const getAlbumsByArtistId = (req, res) => {
  const { artistId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      Album.findAll({
        where: { artistId: artistId },
        include: [
          {
            model: Artist,
            as: "artist",
          },
        ],
      })
        .then((albums) => {
          res.status(200).json(albums);
        })
        .catch(console.error);
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

const deleteAlbum = (req, res) => {
  const { albumId } = req.params;
  Album.destroy({ where: { id: albumId } }).then((numOfRowsDeleted) => {
    if (numOfRowsDeleted === 0) {
      res.status(404).json({ error: "The album does not exist." });
    }
    res.status(204).json(numOfRowsDeleted);
  });
};

module.exports = { create, list, getAlbumsByArtistId, update, deleteAlbum };
