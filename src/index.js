import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import initializeDb from './db';

const PORT = process.env.API_PORT || 8081;
const GRAPHIQL = process.env.NODE_ENV === 'development';


const { /* db, */ schema, rootValue } = initializeDb();

const app = express();

app.use(cors());
app.use('/graphql', graphqlHTTP({
  graphiql: GRAPHIQL,
  schema,
  rootValue,
}));


const server = app.listen(PORT, () => {
  const { port } = server.address();
  console.info(`GraphQL listening at http://localhost:${port}`);
  if (GRAPHIQL) console.info(`GraphiQL listening at http://localhost:${port}/graphiql`);
});
