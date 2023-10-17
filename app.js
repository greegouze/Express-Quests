require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json())

const port = process.env.APP_PORT ?? 3000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

//route user
app.get("/api/users", movieHandlers.getUser);
app.get("/api/users/:id", movieHandlers.getUserId);

//route POST
// app.post("/api/movies", movieHandlers.postMovie);
/* app.post("/api/users", movieHandlers.postUsers) */

//route UPDATE
/* app.put("/api/movies/:id", movieHandlers.updateMovie);
app.put("/api/users/:id", movieHandlers.updateUser); */

//Validation
const {validateMovie, validateUser} = require("./validators")

app.post("/api/movies", validateMovie, movieHandlers.postMovie)
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);

app.post("/api/users", validateUser, movieHandlers.postUsers) 
app.put("/api/users/:id", validateUser, movieHandlers.updateUser);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
