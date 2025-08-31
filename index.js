const express = require("express");
const morgan = require("morgan");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

morgan.token("post", function (req, res) {
  return JSON.stringify(req.body);
});

const morganFormat = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-type"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    tokens.post(req, res),
  ].join(" ");
});

app.use(morganFormat);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const checkIfIdExist = (id) => {
  return persons.some((person) => person.id === id);
};

const checkIfNameExist = (name) => {
  return persons.some((person) => person.name === name);
};

const generateId = () => {
  const newId = Math.floor(Math.random() * 25);
  if (checkIfIdExist(newId)) {
    return generateId();
  }

  return newId;
};

app.get("/", (req, res) => {
  const date = new Date();

  res.send(`<h1>Phonebook has information for 2 people <br/>${date}</h1>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const personId = Number(req.params.id);
  console.log(personId);
  const person = persons.find((person) => person.id === personId);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number || checkIfNameExist(name)) {
    const message = {
      error: name && number ? "name already exist" : "property missing",
    };
    res.status(400).json(message);
  }

  const newPerson = {
    id: generateId(),
    name,
    number,
  };
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
