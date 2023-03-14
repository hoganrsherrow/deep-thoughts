const mongoose = require('mongoose');

// changed localhost since mongod does not bind to IPv6 addresses.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0/deep-thoughts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

module.exports = mongoose.connection;
