const projects = [
  {
    name: "Project Alpha",
    progress: 80,
    description: "A cutting-edge AI project",
  },
  {
    name: "Project Beta",
    progress: 50,
    description: "Blockchain-based supply chain solution",
  },
  { name: "Project Gamma", progress: 30, description: "IoT smart home system" },
];

const asciiArt = {
  "Project Alpha": `
   /\\
  /  \\
 /____\\
/      \\
  A I
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
    projectElement.addEventListener("click", () => showProject(project));
    projectList.appendChild(projectElement);
  });
}

function showProject(project) {
  const asciiDisplay = document.getElementById("ascii-display");
  const projectDescription = document.getElementById("project-description");

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

document.addEventListener("DOMContentLoaded", () => {
  createTerminal();
  createParticles();
});
