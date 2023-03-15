// express.js server
const express = require('express');

const path = require('path');

// apollo
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');

// mongodb connection
const db = require('./config/connection');

// authorization
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// to serve static assets
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
};

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async (typeDefs, resolvers, context) => {
  await server.start();
  // integrate Apollo server w/ Express app
  server.applyMiddleware({ app });
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  });
};

// call func to start server
startApolloServer(typeDefs, resolvers);