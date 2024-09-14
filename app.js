// Global variables
let spotifyToken = null;

// Global functions

const projects = [
  {
    name: "Project Pokédex",
    progress: 20,
    description: "A CLI for pokemon info",
  },
  {
    name: "Project Listener's Block",
    progress: 50,
    description: "Music for your exact mood",
  },
  { name: "Project Gamma", progress: 30, description: "IoT smart home system" },
];

const asciiArt = {
  "Project Pokédex": `
   （╯°□°）╯︵◓

  Project Pokédex
    `,
  "Project Listener's Block": `
     ♪
   ♫  
  ♪♪
     o(^_^)o
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

function handleSubmitSpotifyRecs(_event) {
  const danceability = Number(
    document.getElementById("input-danceability").value
  );
  if (isNaN(danceability)) {
    alert("Please enter a valid number for danceability.");
    return;
  }
  // const valence = document.getElementById("valence").value;
  // const energy = document.getElementById("energy").value;
  // const tempo = document.getElementById("tempo").value;

  const baseApiURL = "https://api.spotify.com/v1/recommendations";
  const urlParams = new URLSearchParams({
    min_danceability: Math.max(danceability - 20, 1) / 100,
    max_danceability: Math.min(danceability + 20, 100) / 100,
    limit: 10,
    seed_genres: "pop",
    // valence,
  });
  const apiURL = `${baseApiURL}?${urlParams.toString()}`;
  const params = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  };

  return fetch(apiURL, params)
    .then((response) => response.json())
    .then((data) => {
      console.log(">>> recs data: ", data);

      // data: seeds, tracks
      // show tracks info

      const tracks = data.tracks;

      const recTracksContainer = document.createElement("div");
      recTracksContainer.id = "rec-tracks-container";

      tracks.forEach((track) => {
        const trackDiv = document.createElement("div");
        trackDiv.className = "rec-track";

        const img = document.createElement("img");
        img.src = track.album.images[0].url;
        img.alt = track.name;
        img.width = 100;
        img.height = 100;

        const artistsNames = document.createElement("p");
        artistsNames.textContent = track.artists
          .map((artist) => artist.name)
          .join(", ");

        const trackName = document.createElement("p");
        trackName.textContent = track.name;

        const playLink = document.createElement("a");
        playLink.href = track.uri;
        playLink.textContent = "Play now";

        trackDiv.appendChild(img);
        trackDiv.appendChild(artistsNames);
        trackDiv.appendChild(trackName);
        trackDiv.appendChild(playLink);

        recTracksContainer.appendChild(trackDiv);
      });

      document
        .getElementById("project-content")
        .appendChild(recTracksContainer);
    })
    .catch((error) => {
      console.error("Error fetching Spotify recommendations:", error);
    });
}

function setInitialListenersBlockContent(project) {
  const contentSection = document.getElementById("project-content");
  contentSection.innerHTML = `
  <div>
  <div class="number-input"> Danceability <input id="input-danceability" type="number" min="1" max="100" /> </div>
  <button id="submit-spotify-recs" >Submit</button>
  </div>
  `;

  document
    .getElementById("submit-spotify-recs")
    .addEventListener("click", handleSubmitSpotifyRecs);
}

function fetchSpotifyToken() {
  const cachedToken = localStorage.getItem("spotifyToken");
  const cachedTimestamp = localStorage.getItem("spotifyTokenTimestamp");
  const currentTime = Date.now();

  if (
    cachedToken &&
    cachedTimestamp &&
    currentTime - parseInt(cachedTimestamp) < 3600000
  ) {
    // Token is still valid (less than 1 hour old)
    spotifyToken = cachedToken;
    return;
  }

  var client_id = "83ccfdd2e4c0440492db71303eabdc40";
  var client_secret = "fb80b15f6bf74e7cad74e0443566ce0a";

  var authOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  };

  return fetch("https://accounts.spotify.com/api/token", authOptions)
    .then((res) => {
      console.log(">>> raw spotify API res: ", res);
      return res.json().then((data) => {
        console.log(">>> chained spotify res: ", data);
        spotifyToken = data.access_token;
        localStorage.setItem("spotifyToken", spotifyToken);
        localStorage.setItem("spotifyTokenTimestamp", Date.now().toString());
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function resetProjectContent() {
  const contentSection = document.getElementById("project-content");
  contentSection.innerHTML = "";
}

function showInitialProjectContent(project) {
  const contentSection = document.getElementById("project-content");

  switch (project.name) {
    case "Project Listener's Block":
      // Add code to fetch API token and display it
      fetchSpotifyToken();
      setInitialListenersBlockContent(project);
      break;
    default:
      resetProjectContent();
  }
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

  // show initial project data in project content area:
  showInitialProjectContent(project);
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
