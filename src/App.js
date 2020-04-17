import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });

  }, []);

  async function handleAddRepository() {
    const dt = new Intl.DateTimeFormat('pt-BR', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Date.now());
    const response = await api.post('repositories', {
      title: `Repositório - ${dt}`,
      url: "http://github.com/",
      techs: [
        "Node",
        "Express",
        "TypeScript"
      ],
      likes: "0"
    })
    const repository = response.data;
    setRepositories([... repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`);
    if(response.status === 204){
      const repositoryIndex = repositories.findIndex(repository => repository.id === id);
      if (repositoryIndex < 0) {
        return response.status(400).json({error: 'Repository not found.'});
      }
      repositories.splice(repositoryIndex, 1);
      setRepositories([... repositories]);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
      {repositories.map(repository =>
        <li key={repository.id}>{repository.title}
          <button onClick={() => handleRemoveRepository(repository.id)}>
            Remover
          </button>
          </li>)}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
