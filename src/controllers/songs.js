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
  Song.findAll({
    include: [
      {
        model: Artist,
        as: "artist",
      },
      {
        model: Album,
        as: "album",
      },
    ],
  }).then((songs) => {
    res.status(200).json(songs);
  });
};

const getSongsByArtistId = (req, res) => {
  const { artistId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      Song.findAll({
        where: { artistId: artistId },
        include: [
          {
            model: Artist,
            as: "artist",
          },
          {
            model: Album,
            as: "album",
          },
        ],
      }).then((songs) => {
        res.status(200).json(songs);
      });
    }
  });
};

const getSongsByAlbumId = (req, res) => {
  const { albumId } = req.params;

  Album.findByPk(albumId).then((album) => {
    if (!album) {
      res.status(404).json({ error: "The album could not be found." });
    } else {
      Song.findAll({
        where: { albumId: albumId },
        include: [
          {
            model: Artist,
            as: "artist",
          },
          {
            model: Album,
            as: "album",
          },
        ],
      }).then((songs) => {
        res.status(200).json(songs);
      });
    }
  });
};

const update = (req, res) => {
  const { songId } = req.params;
  Song.update(req.body, { where: { id: songId } }).then(
    ([numOfRowsUpdated]) => {
      if (numOfRowsUpdated === 0) {
        res.status(404).json({ error: "The song does not exist." });
      } else {
        res.status(200).json([numOfRowsUpdated]);
      }
    }
  );
};

const deleteSong = (req, res) => {
  const { songId } = req.params;
  Song.destroy({ where: { id: songId } }).then((numOfRowsDeleted) => {
    if (numOfRowsDeleted === 0) {
      res.status(404).json({ error: "The song does not exist." });
    }
    res.status(204).json(numOfRowsDeleted);
  });
};

module.exports = {
  create,
  list,
  getSongsByArtistId,
  getSongsByAlbumId,
  update,
  deleteSong,
};
