var bookshelf = require('bookshelf');

function connect() {
  bookshelf.PG = bookshelf.initialize({
    client: 'pg',
    connection: {
      host: "localhost",
      user: "postgres",
      database: "simplestudy_dev"
    }
  });
}

exports.connect = connect;