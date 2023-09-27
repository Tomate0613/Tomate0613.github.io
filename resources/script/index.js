//Background
for (let i = 0; i < 100; i++) {
  const u = document.createElement("div");
  u.classList.add("box");
  u.style.animationDelay = `${Math.random() * -100}s`;
  u.style.animationDuration = `${Math.random() * 15 + 15}s`;
  u.style.left = `${i}vw`;

  document.getElementById('particles').appendChild(u);
}

//Projects
const projects = document.getElementsByClassName("project");

const randomImage = (folder, start, stop) => {
  return `${folder}/${Math.floor(Math.random() * (stop - start + 1)) + start
    }.png`;
}

document.querySelectorAll(".project").forEach((project) => {
  const folder = project.dataset.folder;
  const start = parseInt(project.dataset.start);
  const stop = parseInt(project.dataset.stop);

  const image = project.getElementsByClassName("image")[0];
  setInterval(() => (image.src = randomImage(folder, start, stop)), 5000);
  image.src = randomImage(folder, start, stop);
});
