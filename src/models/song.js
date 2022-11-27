module.exports = (connection, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    duration: DataTypes.STRING,
    file: DataTypes.STRING,
    views: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
  };

  const SongModel = connection.define("Song", schema);
  return SongModel;
};
