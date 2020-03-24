const mysql = require("mysql");
function connect() {
    // create the connection object
    const connection = mysql.createConnection({
        host: "localhost",

        // Your port; if not 3306
        port: 3306,
    
        // Your username
        user: "root",
    
        // Your password
        password: "rashmi9876",
        database: "top_songsdb"
    });

    
}

module.exports = {connect};