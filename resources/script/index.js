//Background
for(let i = 0; i < 100; i++){
  const u = document.createElement('div');
  u.classList.add('box');
  u.style.animationDelay = `${Math.random() * -100}s`;
  u.style.animationDuration = `${Math.random() * 15 + 15}s`
  u.style.left = `${i}vw`;

  document.getElementById('container').appendChild(u);
}

const projects = document.getElementsByClassName('project');

for(let i = 0; i < projects.length; i++){
  const item = projects.item(i);
  item.addEventListener('click', () => {
    window.location.href = item.getAttribute('href');
  });

  const folder = item.dataset.folder;
  const start = parseInt(item.dataset.start);
  const stop = parseInt(item.dataset.stop);

  const image = item.getElementsByClassName('image')[0];
  setInterval(() => image.src = randomImage(folder, start, stop), 5000);
  image.src = randomImage(folder, start, stop);
}

function randomImage(folder, start, stop) {
  return `${folder}/${Math.floor(Math.random() * (stop - start + 1)) + start}.png`;
}