module.exports = (connection, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    image: DataTypes.STRING,
    composer: DataTypes.BOOLEAN,
    singer: DataTypes.BOOLEAN,
    followers: DataTypes.INTEGER,
  };

  const ArtistModel = connection.define("Artist", schema);
  return ArtistModel;
};
