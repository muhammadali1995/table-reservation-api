const express = require("express");
const app = express();
const cors = require("cors");

// Routers //
const userRouter = require("./routes/users");
const restaurantRouter = require("./routes/restaurants");
const tableRouter = require('./routes/tables');
const reservationRouter = require('./routes/reservations');
// Routers //

require("./db/mongoose");

app.use(cors());
app.use(express.json());


app.use(userRouter);
app.use(restaurantRouter);
app.use(tableRouter);
app.use(reservationRouter);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, function () {
//   console.log("Server is running on Port: " + PORT);
// });

app.get("/", (req, res) => {
  res.send("Api is running");
});

module.exports = app;
