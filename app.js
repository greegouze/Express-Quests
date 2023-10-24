require("dotenv").config();
const { hashPassword, verifyPassword, verifyToken } = require("./auth");
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 3000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

// public routes
app.get("/", welcome);

//public route movies
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

// public route user
app.get("/api/users", userHandlers.getUser);
app.get("/api/users/:id", userHandlers.getUserId);

//Validation
const { validateMovie, validateUser } = require("./validators");

//route DELETE
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", userHandlers.deleteUser);

//login

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken) 

app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);

app.post("/api/users", hashPassword, validateUser, userHandlers.postUsers);
app.put("/api/users/:id", hashPassword, validateUser, userHandlers.updateUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
