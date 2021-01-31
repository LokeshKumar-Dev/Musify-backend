const express = require("express");
const app = express();
const artistControllers = require("./controllers/artists");
const albumControllers = require("./controllers/albums");
const songControllers = require("./controllers/songs");

app.use(express.json());

// artists

app.get("/", artistControllers.welcome);

app.post("/artists", artistControllers.create);

app.get("/artists", artistControllers.list);

app.get("/artists/:artistId", artistControllers.getArtistById);

app.patch("/artists/:id", artistControllers.update);

app.delete("/artists/:artistId", artistControllers.deleteArtist);

// albums

app.post("/artists/:artistId/albums", albumControllers.create);

app.get("/albums", albumControllers.list);

app.get("/artists/:artistId/albums", albumControllers.getAlbumsByArtistId);

app.patch("/albums/:albumId", albumControllers.update);

app.delete("/albums/:albumId", albumControllers.deleteAlbum);

// songs

app.post("/artists/:artistId/albums/:albumId/songs", songControllers.create);

app.get("/songs", songControllers.list);

app.get("/artists/:artistId/songs", songControllers.getSongsByArtistId);

app.get("/albums/:albumId/songs", songControllers.getSongsByAlbumId);

app.patch("/songs/:songId", songControllers.update);

app.delete("/songs/:songId", songControllers.deleteSong);

module.exports = app;
