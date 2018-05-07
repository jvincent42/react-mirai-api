import Loki from 'lokijs';
import { buildSchema } from 'graphql';

import Todos from './todos';


const initializeDb = (filename = 'data.json', baseSchema = '') => {
  const lokidb = new Loki(filename);

  const init = db => db
    |> Todos.initializeCollection;

  const mocks = db => db
    |> Todos.mocks;

  const db = lokidb
    |> init
    |> mocks;

  const schema = baseSchema
    |> Todos.getSchema
    |> buildSchema;

  const { root: rootValue } = { db, root: {} }
    |> Todos.rootValue;

  return {
    db,
    schema,
    rootValue,
  };
};


export default initializeDb;
