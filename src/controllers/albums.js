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
        artistId: req.params.artistId,
      }).then((album) => {
        res.status(201).json(album);
      });
    }
  });
};

module.exports = { create };
