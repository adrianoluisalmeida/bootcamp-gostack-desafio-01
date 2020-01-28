const express = require('express');
const server = express();

server.use(express.json());

//Vetor de projets
const projects = [];
var countRequest = 0;

//Middlewares
function countRequests(req, res, next){
  countRequest++;
  console.log(`Total de requisições feitas para a API: ${countRequest}`);

  return next();
}

//verifica se o id do param existe
function checkIdExists(req, res, next){

  const {id} = req.params;
  const index = projects.findIndex(x => x.id === id);
  
  if(index >= 0){
    res.locals.index = index;
    return next();
  }

  return res.status(400).json({error: 'Project id does not exists'});

}

//Insere projeto
server.post('/projects', countRequests, (req, res) => {
  projects.push(req.body);
  return res.json(projects);
});

//Rota lista todos os projetos
server.get('/projects', countRequests, (req, res) => {
  return res.json(projects);
});

//Altera projeto específico
server.put('/projects/:id', countRequests, checkIdExists, (req, res) => {
  
  const index = res.locals.index;
  projects[index] = req.body;

  return res.json(projects[index]);
});

//Delete projeto específico
server.delete('/projects/:id', countRequests, checkIdExists, (req, res) => {
  
  projects.splice(res.locals.index, 1);
  
  return res.send();
});

//Adiciona uma tarefa a determinado projeto
server.post('/projects/:id/tasks', countRequests, checkIdExists, (req, res) => {
  
  const {title} = req.body;
  projects[res.locals.index].tasks.push(title);

  return res.json(projects);

});

server.listen(3000);