const express = require("express");
const app = express();
const artistControllers = require("./controllers/artists");
const albumControllers = require("./controllers/albums");
const songControllers = require("./controllers/songs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// artists
app.get("/", artistControllers.welcome);

app.post("/artists", artistControllers.create);

app.get("/artists", artistControllers.list);

app.get("/artists/:artistId", artistControllers.getArtistById);

app.patch("/artists/:id", albumControllers.uploadImg.single('image'), artistControllers.update);

app.delete("/artists/:artistId", artistControllers.deleteArtist);

// albums

app.post("/artists/:artistId/albums", albumControllers.uploadImg.single('image'), albumControllers.create);

app.get("/albums", albumControllers.list);
app.get("/albums/:image", albumControllers.imageStream);

app.get("/artists/:artistId/albums", albumControllers.getAlbumsByArtistId);

app.patch("/albums/:albumId", albumControllers.uploadImg.single('image'), albumControllers.update);

app.delete("/albums/:albumId", albumControllers.deleteAlbum);

// songs

app.post("/artists/:artistId/albums/:albumId/songs", songControllers.uploadSong.single('music'), songControllers.create);

app.get("/songs/feed", songControllers.feed);

app.get("/songs", songControllers.list);
app.get("/songs/:file", songControllers.media);

app.get("/artists/:artistId/songs", songControllers.getSongsByArtistId);

app.get("/albums/:albumId/songs", songControllers.getSongsByAlbumId);

app.patch("/songs/:songId", songControllers.update);

app.delete("/songs/:songId", songControllers.deleteSong);

module.exports = app;
