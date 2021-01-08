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
      }).then((album) => {
        album.setArtist(artist);
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe("POST /artists/:artistId/albums/:albumId/songs", () => {
    "it creates a new song for a given artist and album",
      (done) => {
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
      };
  });
});
