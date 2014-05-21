var bookshelf = require('bookshelf');

function connect() {
  bookshelf.PG = bookshelf.initialize({
    client: 'pg',
    connection: process.env.DATABASE_URL
  });
}

exports.connect = connect;