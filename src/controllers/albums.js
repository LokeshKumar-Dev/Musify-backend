const { Album, Artist } = require("../models");
const fs = require('fs');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images')
  },
  filename: function (req, file, cb) {
    const mimeExtension = {
      'image/jpeg': '.jpeg',
      'image/jpg': '.jpg',
      'image/png': '.png',
    }
    cb(null, file.fieldname + '-' + Date.now() + mimeExtension[file.mimetype]);
  }
})

const uploadImg = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('fileType', file.mimetype)
    if (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
      req.fileError = 'File format is not valid';
    }
  }
})

const create = (req, res) => {
  const { artistId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      if (req.fileError) {
        console.log(req.file)
        res.status(404).json({ error: "The file is not proper" });
      }
      else {
        Album.create({
          name: req.body.name,
          year: req.body.year,
          artistId: artistId,
          image: req.file.filename,
        }).then((album) => {
          album.setArtist(artist).then((album) => {
            res.status(201).json(album);
          });
        });
      }
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

const imageStream = (req, res) => {
  var filepath = 'uploads/images/' + req.params.image;
  var readStream;


  if (!fs.existsSync(filepath)) {
    console.log('file not exoist')
    readStream = fs.createReadStream('uploads/images/bg.jpg');
  }
  else {
    readStream = fs.createReadStream(filepath);
  }

  readStream.on('open', function () {
    readStream.pipe(res);
  });

  readStream.on('error', function (err) {
    res.end(err);
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

  Album.update({'image': req.file.filename , ...req.body}, { where: { id: albumId } }).then(
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

module.exports = { create, list, getAlbumsByArtistId, update, deleteAlbum, uploadImg, imageStream };
