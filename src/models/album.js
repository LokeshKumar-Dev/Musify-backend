module.exports = (connection, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    year: DataTypes.INTEGER,
  };

  const AlbumModel = connection.define("Album", schema);
  return AlbumModel;
};
