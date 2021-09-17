const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/users.js', './routes/restaurants.js', './routes/reservations.js', './routes/tables.js']

swaggerAutogen(outputFile, endpointsFiles)
