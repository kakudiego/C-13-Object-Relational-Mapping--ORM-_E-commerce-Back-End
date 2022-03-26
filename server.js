const express = require('express');
const routes = require('./routes');
// import sequelize connection
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

// // sync db
// db.sequelize.sync({ force: true }).then(() => {
//   app.listen(PORT, () => {
//     console.log(`🌎 ==> API server now on port ${PORT}!`);
//   });
// });
