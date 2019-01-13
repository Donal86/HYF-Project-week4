const mysql = require('mysql');
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'milan_houses',
    port: 3306
})
dbConnection.connect(function (err) {
    if (err) throw err
})

module.exports = dbConnection;