const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { username, name } = request.body;

  const checksUsernameExist = users.some((user) => user.username === username
  );

  if (checksUsernameExist) {
    return response.status(400).json({ error: 'Username already exists!' });
  }

  users.push({
    id: uuidv4(), // precisa ser um uuid
    name,
    username,
    todos: []
  })

  return response.status(201).send();

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(newTodo);

  return response.status(201).send();

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const selectedTodo = user.todos.find(todo => todo.id === id);

  if (!selectedTodo) {
    return response.status(404).json({ error: "Todo does not exist" })
  }

  selectedTodo.title = title;
  selectedTodo.deadline = new Date(deadline);

  return response.status(201).send();

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;