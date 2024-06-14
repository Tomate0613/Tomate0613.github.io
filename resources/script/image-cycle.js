function imageSrc(folder, idx, fileType) {
  return `${folder}/${idx}.${fileType}`;
}

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

async function setupImages() {
  const images = document.querySelectorAll('.img-cycle');

  for (let i = 0; i < images.length; i++) {
    const elem = images[i];
    console.log(elem);

    const folder = elem.dataset['folder'];
    const filetype = elem.dataset['filetype'];
    const times = elem.dataset['times']?.split(',').map((n) => +n);
    const start = +(
      elem.dataset['start'] ??
      elem.attributes.src.nodeValue.replace(`${folder}/`, '').replace(`.${filetype}`, '')
    );
    console.log(start);
    const stop = +(elem.dataset['stop'] ?? times?.length);
    const random = elem.dataset['random'];

    let idx = start;

    while (true) {
      elem.src = imageSrc(folder, idx, filetype);

      await sleep(times?.[idx - start] ?? 12000);

      if (!random && ++idx > stop) idx = start;
      if (random) idx = Math.round(Math.random() * (stop - start)) + start;
    }
  }
}

setupImages();
