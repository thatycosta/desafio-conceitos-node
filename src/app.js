const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likesRepo = [];

app.get("/repositories", (request, response) => {

  if (repositories < 0) {
    return response.json({ error: 'data not found' });
  }

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const id = uuid();

  if (likesRepo.findIndex(element => element.id === id) == -1) {
    let numberOfLikes = 0;

    const newLikeObject = {
      id,
      numberOfLikes
    }

    likesRepo.push(newLikeObject);
  }

  const indexOfLikes = likesRepo.findIndex(element => element.id === id);
  const likes = likesRepo[indexOfLikes].numberOfLikes;


  const newInfo = {
    id,
    url,
    title,
    techs,
    likes
  }

  repositories.push(newInfo);

  return response.json(newInfo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  if (repositories.findIndex(repo => repo.id === id) == -1) {
    return response.status(400).json({ error: 'Bad Request' });
  }

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  const repoTest = repositories[repositorieIndex];

  repoTest.url = url;  
  repoTest.title = title;
  repoTest.techs = techs;

  repositories[repositorieIndex] = repoTest;

  return response.json(repositories[repositorieIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (repositories.findIndex(repo => repo.id === id) == -1) {
    return response.status(400).json({ error: 'Bad Request' });
  }

  const repoIndex = repositories.findIndex(element => element.id === id);

  repositories.splice(repoIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (repositories.findIndex(repo => repo.id === id) == -1) {
    return response.status(400).json({ error: 'Bad Request' });
  }

  const index = likesRepo.findIndex(element => element.id === id);
  const specifLike = likesRepo[index];
  specifLike.numberOfLikes++;

  const indexRepo = repositories.findIndex(element => element.id === id);
  const specifLikeRepo = repositories[indexRepo];
  specifLikeRepo.likes = specifLike.numberOfLikes;

  return response.json({"likes": specifLike.numberOfLikes});
});

module.exports = app;
