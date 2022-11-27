const Sequelize = require("sequelize");
const ArtistModel = require("./artist");
const AlbumModel = require("./album");
const SongModel = require("./song");

const {
  MYSQLDATABASE,
  MYSQLUSER,
  MYSQLPASSWORD,
  MYSQLHOST,
  MYSQLPORT,
  MYSQL_URL,
} = process.env;

// const {
//   DB_NAME,
//   DB_USER,
//   DB_PASSWORD,
//   DB_HOST,
//   PORT,
//   CLEARDB_DATABASE_URL,
// } = process.env;


const setupDatabase = () => {
  const connection = MYSQL_URL
    ? new Sequelize(MYSQL_URL)
    : new Sequelize(MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, {
        host: MYSQLHOST,
        port: MYSQLPORT,
        dialect: "mysql",
        logging: false,
      });

  const Artist = ArtistModel(connection, Sequelize);
  const Album = AlbumModel(connection, Sequelize);
  const Song = SongModel(connection, Sequelize);

  Album.belongsTo(Artist, { as: "artist" });
  Song.belongsTo(Artist, { as: "artist" });
  Song.belongsTo(Album, { as: "album" });

  connection.sync({ alter: true });
  return {
    Artist,
    Album,
    Song,
  };
};

module.exports = setupDatabase();
