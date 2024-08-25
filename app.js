// Global variables
// ...

// Global functions

const projects = [
  {
    name: "Project Pokédex",
    progress: 20,
    description: "A simple CLI for seeing pokemon info",
  },
  {
    name: "Project Beta",
    progress: 50,
    description: "Blockchain-based supply chain solution",
  },
  { name: "Project Gamma", progress: 30, description: "IoT smart home system" },
];

const asciiArt = {
  "Project Pokédex": `
   （╯°□°）╯︵◓

  Project Pokédex
    `,
  "Project Beta": `
 ______
|      |
|  []  |
|______|
 /    \\
/      \\
    `,
  "Project Gamma": `
   _____
  /     \\
 /  [○]  \\
/  [○]    \\
\\    [○]  /
 \\_______/
    `,
};

function createTerminal() {
  const projectList = document.getElementById("project-list");
  projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.className = "project-item";
    projectElement.innerHTML = `
            <p class="glow">> ${project.name}</p>
            <div class="progress-bar">
                <div class="progress glow" style="width: ${project.progress}%"></div>
            </div>
        `;
    projectElement.addEventListener("click", () => selectProject(project));
    projectList.appendChild(projectElement);
  });
}

function updateCurrentProjectName(projectName) {
  const currentProject = document.getElementById("current-project");
  if (currentProject.textContent === projectName) {
    currentProject.textContent = null;
  } else {
    currentProject.textContent = projectName;
  }
}

function selectProject(project) {
  updateCurrentProjectName(project.name);
  showProject(project);
}

// show project, hides it if it's the current project
function showProject(project) {
  const asciiDisplay = document.getElementById("ascii-display");
  const projectDescription = document.getElementById("project-description");

  if (asciiDisplay.textContent === asciiArt[project.name]) {
    asciiDisplay.textContent = null;
    projectDescription.textContent = null;
    return;
  }

  asciiDisplay.textContent = asciiArt[project.name];
  projectDescription.textContent = project.description;

  // Add a simple fade-in effect
  asciiDisplay.style.opacity = 0;
  projectDescription.style.opacity = 0;
  setTimeout(() => {
    asciiDisplay.style.opacity = 1;
    projectDescription.style.opacity = 1;
  }, 50);
}

function createParticles() {
  const particlesContainer = document.getElementById("particles");
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particlesContainer.appendChild(particle);
  }
}

function handleInput(event) {
  console.log(">>> event tripped: ", event);
  if (event.key === "Enter") {
    var input = document.getElementById("command-input").value;
    console.log(">>> input: ", input);
    input = input.split(" ")[0].toLowerCase();

    fetchPokemonData(input);
  }
}

function updateJsonDisplay(data) {
  const jsonDisplay = document.getElementById("project-content");
  jsonDisplay.textContent = JSON.stringify(data, null, 2);
}

function updatePokemonProjectContent(data) {
  // update project contents with:
  // - number in dex (id)
  // - name
  // - image
  // - types
  // - description
  // - cries (will need to intro local state)
  const typesList = data.types.map((type) => type.type.name);
  const types = typesList.join(", ");

  const content = document.getElementById("project-content");
  content.innerHTML = `
    <div class="pokedex-content">
      <h2>#${data.id} ${data.name}</h2>
      <h4>${types.length > 1 ? "Types" : "Type"}: {${types}}</h4>
      <img id="pokemon-image" src="${
        data.sprites.front_default
      }" alt="Pokemon Image">
    </div>
  `;
}

function fetchPokemonData(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Pokemon not found");
      }
      return response.json();
    })
    .then((data) => {
      updatePokemonProjectContent(data);
    })
    .catch((error) => {
      // TODO: handle error
      console.error("Error fetching Pokemon data:", error.message);
      updateJsonDisplay({ error: error.message });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  createTerminal();
  createParticles();

  // event listener for input commands
  const inputElement = document.getElementById("command-input");
  inputElement.addEventListener("keypress", handleInput);
  // document.getElementById('command-input').addEventListener('keypress', handleInput);
});
