const pg = require("pg");
const Sequelize = require("sequelize");

const ArtistModel = require("./artist");
const AlbumModel = require("./album");
const SongModel = require("./song");
const UserModel = require("./user");

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
  // const params = url.parse(process.env.DATABASE_URL);
  // const auth = params.auth.split(":");
  console.log({
    MYSQLDATABASE,
    MYSQLUSER,
    MYSQLPASSWORD,
    MYSQLHOST,
    MYSQLPORT,
    MYSQL_URL,
  })
  const ssl = true; 
  const connection = new Sequelize("musify_db_29", "loki", "ufHthCU4aXkh4WRRLQTTRxIyMvRWhmWX", {
        host: "dpg-cgd8as02qv2aq5jd9q60-a",
        port: 5432,
        dialect: "postgres",
        dialectOptions: {
          ssl: ssl && typeof ssl === 'object' // use ssl instead of self
              ? { rejectUnauthorized: false, ...self.ssl }
              : { rejectUnauthorized: false },
        },
      });

  const Artist = ArtistModel(connection, Sequelize);
  const Album = AlbumModel(connection, Sequelize);
  const Song = SongModel(connection, Sequelize);
  const User = UserModel(connection, Sequelize);

  Album.belongsTo(Artist, { as: "artist" });
  Song.belongsTo(Artist, { as: "artist" });
  Song.belongsTo(Album, { as: "album" });

  connection.sync({ alter: true });
  console.log("connected");
  return {
    Artist,
    Album,
    Song,
    User,
  };
};

module.exports = setupDatabase();
