module.exports = (connection, DataTypes) => {
    const schema = {
      name : DataTypes.STRING,
      song : DataTypes.STRING,
    }
  
    const SongDModel = connection.define('SongD', schema)
    return  SongDModel;
  }