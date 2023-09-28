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

document.querySelectorAll('.image-cycle').forEach(async (project) => {
  const folder = project.dataset.folder;
  const start = parseInt(project.dataset.start);
  const stop = parseInt(project.dataset.stop);
  const fileType = project.dataset.filetype ?? 'png';
  const times = project.dataset.times?.split(',');

  const image = project.getElementsByClassName('image')[0];

  image.src = imageSrc(folder, 0, fileType);

  let idx = start - 1 + 2;

  while (true) {
    if (++idx > stop) idx = start;

    image.src = imageSrc(folder, idx, fileType);
    await sleep(times?.[idx - start] ?? 12000);
  }
});
