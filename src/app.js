const express = require('express');
const app = express();
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');

app.use(express.json());

// app.get('/', (req, res) => {
//     res.status(200).send('Hello world!');
// });

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:artistId', artistControllers.getArtistById);

app.patch('/artists/:id', artistControllers.updateGenre);

app.delete('/artists/:artistId', artistControllers.deleteArtist);

app.post('/artists/:artistId/albums', albumControllers.create);

module.exports = app;