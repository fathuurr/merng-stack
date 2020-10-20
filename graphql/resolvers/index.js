const postsResolvers = require('../resolvers/posts');
const usersResolvers = require('../resolvers/users');

module.exports = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};
