import uuid from 'uuid/v4';


const getSchema = baseSchema => (`
  ${baseSchema}
  type Todo {
    id: String!,
    name: String!,
    done: Boolean,
    content: String,
    createdAt: String
  }
  input TodoInput {
    name: String!,
    content: String,
  }
  type Mutation {
    addTodo(todo: TodoInput): Todo
  }
  type Query {
    todos: [Todo],
    todo(id: String!): Todo
  }
`);


const createOne = variables => ({
  id: uuid(),
  createdAt: new Date(),
  done: false,
  ...variables,
});


const initializeCollection = (db) => {
  /* Collection */
  const todosCollection = db.addCollection('todos', {
    unique: ['id'],
  });

  /* DynamicView todos */
  todosCollection
    .addDynamicView('todos')
    .applySimpleSort('createdAt', true);

  /* DynamicView dones */
  todosCollection
    .addDynamicView('dones')
    .applyFind({ done: true })
    .applySimpleSort('createdAt', true);

  /* DynamicView remainings */
  todosCollection
    .addDynamicView('remainings')
    .applyFind({ done: false })
    .applySimpleSort('createdAt', true);

  return db;
};


const insertNew = (db, variables) => {
  const todosCollection = db.getCollection('todos');
  const newTodo = createOne(variables);
  todosCollection.insert(newTodo);
  return newTodo;
};


const mocks = (db) => {
  insertNew(db, {
    id: 'ft_id',
    name: '42mtfker',
    content: 'born2code',
  });
  insertNew(db, {
    id: 'ft_id2',
    name: 'test 2',
    done: false,
    createdAt: new Date('2018-05-03T23:25:27.690Z'),
    content: 'abc',
  });
  insertNew(db, {
    name: 'test 3',
    done: true,
    createdAt: new Date('2018-05-04T23:25:27.690Z'),
  });
  insertNew(db, {
    name: 'test 4',
    done: false,
    createdAt: new Date('2018-05-02T23:25:27.690Z'),
  });
  return db;
};


// TODO: find a pretty way to do this, this is freaky as f*
const rootValue = ({ db, root }) => ({
  db,
  root: {
    ...root,
    addTodo: ({ todo }) => insertNew(db, todo),
    todos: () => db.getCollection('todos').getDynamicView('todos').data(),
    todo: ({ id }) => db.getCollection('todos').by('id', id),
  },
});


const moduleApi = {
  getSchema,
  createOne,
  initializeCollection,
  insertNew,
  mocks,
  rootValue,
};
export default moduleApi;
