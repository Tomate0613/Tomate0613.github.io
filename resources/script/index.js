//Background
for (let i = 0; i < 100; i++) {
  const u = document.createElement('div');
  u.classList.add('box');
  u.style.animationDelay = `${Math.random() * -100}s`;
  u.style.animationDuration = `${Math.random() * 15 + 15}s`;
  u.style.left = `${i}vw`;

  document.getElementById('particles').appendChild(u);
}

//Projects
const projects = document.getElementsByClassName('project');

const imageSrc = (folder, idx, fileType) => {
  return `${folder}/${idx}.${fileType}`;
};

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));
