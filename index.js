const app = require("./src/app");

const APP_PORT = process.env.PORT || 4000;

app.listen(APP_PORT, () => {
  console.log(`Server is listening at port: ${APP_PORT}`);
});
