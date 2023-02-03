const { Album, Artist, Song, SongD } = require("../models");

const multer = require('multer');
const fs = require('fs');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/songs')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.mp3');
  }
})

const uploadSong = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('fileType', file)
    if (file.mimetype === 'audio/mpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      req.fileError = 'File format is not valid';
    }
  }
})

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
          if (req.fileError) {
            console.log(req.file)
            res.status(404).json({ error: "The file is not proper" });
          }
          else {
            Song.create({
              name: req.body.name,
              file: req.file.filename,
              year: req.body.year,
              duration: req.body.duration,
              artistId: artistId,
              albumId: albumId,
            }).then((song) => {
              res.status(201).json(song);
            });
          }
        }
      });
    }
  });
};

const media = (req, res) => {
  const fileName = req.params.file

  var filePath = 'uploads/songs/' + fileName;
  var stat = fs.statSync(filePath);
  range = req.headers.range;
  var readStream;

  if (range !== undefined) {
    var parts = range.replace(/bytes=/, "").split("-");

    var partial_start = parts[0];
    var partial_end = parts[1];

    if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
      return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
    }

    var start = parseInt(partial_start, 10);
    var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
    var content_length = (end - start) + 1;

    res.status(206).header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': content_length,
      'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
    });

    readStream = fs.createReadStream(filePath, { start: start, end: end });
  } else {
    res.header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });
    readStream = fs.createReadStream(filePath);
  }
  readStream.pipe(res);
}

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

const demo = async (req, res) => {
  const new_releases_songs = await Song.findAll({
    where: {
      year: {
        [op.lt]: 2022
      }
    },
    order: [
      ['name', 'DESC'],
    ],
    limit: 15,
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
  });

  const new_releases = {
    "id": "1",
    "name": "90's Gold",
    "description": "New to music world",
    "isPlaylist": false,
    "tracks": {
      "image": "https://www.sunpictures.in/wp-content/uploads/2021/03/Anirudh-Ravichander-1-150x150.jpg",
      "items": new_releases_songs
    }
  }

  res.status(200).json([new_releases]);
};

const feed = async (req, res) => {

  const new_releases_songs = await Song.findAll({
    where: {
      year: 2022
    },
    order: [
      ['name', 'DESC'],
    ],
    limit: 15,
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
  })

  const top_hits_songs = await Song.findAll({
    order: [
      ['views', 'DESC'],
      ['name', 'ASC'],
    ],
    limit: 6,
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
  })

  const artist_songs = await Artist.findAll({
    order: [
      ['followers', 'DESC'],
    ],
    // limit: 7,
  })


  //Playlist
  const new_releases = {
    "id": "1",
    "name": "New Releases",
    "description": "New to music world",
    "isPlaylist": false,
    "tracks": {
      "image": "https://www.sunpictures.in/wp-content/uploads/2021/03/Anirudh-Ravichander-1-150x150.jpg",
      "items": new_releases_songs
    }
  }
  const top_hits = {
    "id": "2",
    "name": "Top Hits",
    "description": "Hits till now that rules the world",
    "isPlaylist": false,
    "tracks": {
      "image": "https://www.sunpictures.in/wp-content/uploads/2021/03/Anirudh-Ravichander-1-150x150.jpg",
      "items": top_hits_songs
    }
  }
  const artist = {
    "id": "3",
    "name": "Artist",
    "description": "Artist that you likes",
    "isPlaylist": true,
    "tracks": {
      "image": "https://www.sunpictures.in/wp-content/uploads/2021/03/Anirudh-Ravichander-1-150x150.jpg",
      "items": artist_songs
    }
  }

  // res.status(200).json({ "status": 200, "data": [new_releases] });
  res.status(200).json([new_releases, top_hits, artist]);
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
        const artist_songs = {
          "id": artistId,
          "name": artist.name,
          "description": artist.genre,
          "image": artist.image,
          "isPlaylist": false,
          "tracks": {
            "image": "https://www.sunpictures.in/wp-content/uploads/2021/03/Anirudh-Ravichander-1-150x150.jpg",
            "items": songs
          }
        }
        res.status(200).json(artist_songs);
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
        const album_songs = {
          "id": albumId,
          "name": album.name,
          "description": album.genre,
          "image": album.image,
          "isPlaylist": false,
          "tracks": {
            "image": "https://www.sunpictures.in/wp-content/uploads/2021/03/Anirudh-Ravichander-1-150x150.jpg",
            "items": songs
          }
        }
        res.status(200).json(album_songs);
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


const getSongsByValue = async (req, res) => {
  const { value } = req.params;

  const songs1 = await Song.findAll({
    where: { name: { [op.substring]: value } },
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
  });

  const artists = await Artist.findAll({
    where: { name: { [op.substring]: value } }
  });

  const albums = await Album.findAll({
    where: { name: { [op.substring]: value } },
  });

  res.status(200).json({
    song: {
      tracks: {
        items: songs1
      }
    },
    artist: {
      isPlaylist: true,
      isAlbum: false,
      tracks: {
        items: artists
      }
    },
    album: {
      isPlaylist: true,
      isAlbum: true,
      tracks: {
        items: albums
      },
    }
  })
};

module.exports = {
  create,
  list,
  feed,
  demo,
  getSongsByArtistId,
  getSongsByAlbumId,
  update,
  deleteSong,
  getSongsByValue,
  uploadSong, media
};
