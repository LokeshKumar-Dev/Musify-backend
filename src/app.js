const express = require("express");
const cors = require("cors");

const app = express();
const artistControllers = require("./controllers/artists");
const albumControllers = require("./controllers/albums");
const songControllers = require("./controllers/songs");
const authController = require("./controllers/authController");

const authRoutes = require("./routes/authRoutes");

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// artists
app.get("/", (req, res) => {
    res.status(200).send("Musify API. Built by Lokesh Kumar M, November 2022. See documentation at https://github.com/LokeshKumar-Dev/Musify-backend for more info. Basic Strtucture By Jennifer(THANKS)");
});

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

app.get("/songs/demo", songControllers.demo);

app.get("/songs", songControllers.list);
app.get("/songs/file/:file", songControllers.media);

app.get("/artists/:artistId/songs", songControllers.getSongsByArtistId);

app.get("/albums/:albumId/songs", songControllers.getSongsByAlbumId);

app.patch("/songs/:songId", songControllers.update);

app.delete("/songs/:songId", songControllers.deleteSong);

app.get("/search/:value", songControllers.getSongsByValue);

app.use('/user' ,authRoutes);

// Protect all routes after this middleware
app.use(authController.protect);
app.get("/songs/feed", songControllers.feed);

module.exports = app;
