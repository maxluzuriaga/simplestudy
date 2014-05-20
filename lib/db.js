var bookshelf = require('bookshelf');

function connect() {
  var url = process.env.DATABASE_URL.split("@");
  var location = url[1].split("/");

  var host = location[0];
  var database = location[1];
  var user = url[0].substring(11, url[0].length)

  bookshelf.PG = bookshelf.initialize({
    client: 'pg',
    connection: {
      host: host,
      user: user,
      database: database
    }
  });
}

exports.connect = connect;