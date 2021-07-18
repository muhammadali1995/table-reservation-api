const mongoose  = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://admin:4377433mt@cluster0.ilxk8.mongodb.net/table-reservation?retryWrites=true&w=majority` || "localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log("mongose connected");
})