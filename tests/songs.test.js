const { expect } = require("chai");
const request = require("supertest");
const { Artist, Album, Song } = require("../src/models");
const app = require("../src/app");

describe("/songs", () => {
  let artist;
  let album;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
      await Song.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      await Song.destroy({ where: {} });

      artist = await Artist.create({
        name: "Tame Impala",
        genre: "Rock",
      });

      album = await Album.create({
        name: "InnerSpeaker",
        year: 2010,
        artistId: artist.id,
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe("POST /artists/:artistId/albums/:albumId/songs", () => {
    it("creates a new song for a given artist and album", (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums/${album.id}/songs`)
        .send({
          name: "It Is Not Meant to Be",
          year: album.year,
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Song.findByPk(res.body.id, { raw: true })
            .then((song) => {
              expect(song.name).to.equal("It Is Not Meant to Be");
              expect(song.year).to.equal(album.year);
              expect(song.artistId).to.equal(artist.id);
              expect(song.albumId).to.equal(album.id);
              done();
            })
            .catch((error) => done(error));
        })
        .catch((error) => done(error));
    });

    it("returns a 404 and does not create the song if the artist does not exist", (done) => {
      request(app)
        .post(`/artists/12345/albums/${album.id}/songs`)
        .send({
          name: "It Is Not Meant to Be",
          year: album.year,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal("The artist could not be found.");

          Song.findAll().then((songs) => {
            expect(songs.length).to.equal(0);
            done();
          });
        })
        .catch((error) => done(error));
    });

    it("returns a 404 and does not create the song if the album does not exist", (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums/6789/songs`)
        .send({
          name: "It Is Not Meant to Be",
          year: album.year,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal("The album could not be found.");

          Song.findAll().then((songs) => {
            expect(songs.length).to.equal(0);
            done();
          });
        })
        .catch((error) => done(error));
    });
  });

  describe("with songs in the database", () => {
    let songs;
    beforeEach((done) => {
      Promise.all(
        Promise.all([
          Song.create({
            name: "It Is Not Meant to Be",
            year: album.year,
            artistId: artist.id,
            albumId: album.id,
          }),
          Song.create({
            name: "Desire Be Desire Go",
            year: album.year,
            artistId: artist.id,
            albumId: album.id,
          }),
          Song.create({
            name: "Alter Ego",
            year: album.year,
            artistId: artist.id,
            albumId: album.id,
          }),
        ]).then((documents) => {
          songs = documents;
          done();
        })
      );
    });

    describe("GET /songs", () => {
      it("gets all song records", (done) => {
        request(app)
          .get("/songs")
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((song) => {
              const expected = songs.find((a) => a.id === song.id);
              expect(song.name).to.equal(expected.name);
              expect(song.year).to.equal(expected.year);
            });
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe("GET /artists/:artistId/songs", () => {
      it("gets all songs for a particular artist (by ID)", (done) => {
        request(app)
          .get(`/artists/${artist.id}/songs`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((song) => {
              const expected = songs.find((a) => a.id === song.id);
              expect(song.name).to.equal(expected.name);
              expect(song.year).to.equal(expected.year);
            });
            done();
          })
          .catch((error) => done(error));
      });

      it("returns a 404 if the artist does not exist", (done) => {
        request(app)
          .get("/artists/12345/songs")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The artist could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe("GET /albums/:albumId/songs", () => {
      it("gets all songs for a particular album (by ID)", (done) => {
        request(app)
          .get(`/albums/${album.id}/songs`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((song) => {
              const expected = songs.find((a) => a.id === song.id);
              expect(song.name).to.equal(expected.name);
              expect(song.year).to.equal(expected.year);
            });
            done();
          })
          .catch((error) => done(error));
      });

      it("returns a 404 if the artist does not exist", (done) => {
        request(app)
          .get("/albums/12345/songs")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The album could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe("PATCH /songs/:songId", () => {
      it("updates song name by id", (done) => {
        const song = songs[0];
        request(app)
          .patch(`/songs/${song.id}`)
          .send({ name: "New Song Name" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Song.findByPk(song.id, { raw: true }).then((updatedSong) => {
              expect(updatedSong.name).to.equal("New Song Name");
              done();
            });
          })
          .catch((error) => done(error));
      });

      it("returns a 404 if the song does not exist", (done) => {
        request(app)
          .patch("/songs/345")
          .send({ name: "Non-existent song" })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The song does not exist.");
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe("DELETE /songs/:songId", () => {
      it("deletes song record by id", (done) => {
        const song = songs[0];
        request(app)
          .delete(`/songs/${song.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Song.findByPk(song.id).then((updatedSong) => {
              expect(updatedSong).to.equal(null);
              done();
            });
          })
          .catch((error) => done(error));
      });

      it("returns a 404 if the song does not exist", (done) => {
        request(app)
          .delete("/songs/4567")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The song does not exist.");
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
