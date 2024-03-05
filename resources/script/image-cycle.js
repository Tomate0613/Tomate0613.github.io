function imageSrc(folder, idx, fileType) {
  return `${folder}/${idx}.${fileType}`;
}

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

async function setupImages() {
  console.log("letse go");
  const images = document.querySelectorAll(".img-cycle");

  for (let i = 0; i < images.length; i++) {
    const elem = images[i];
    console.log(elem);

    const folder = elem.dataset["folder"];
    const times = elem.dataset["times"]?.split(",").map((n) => +n);
    const start = +elem.dataset["start"];
    const stop = +(elem.dataset["stop"] ?? times?.length);
    const filetype = elem.dataset["filetype"];
    const random = elem.dataset["random"];

    let idx = start;

    while (true) {
      elem.src = imageSrc(folder, idx, filetype);

      await sleep(times?.[idx - start] ?? 12000);

      if (!random && ++idx > stop) idx = start;
      if(random) idx = Math.round(Math.random() * (stop - start)) + start;
    }
  }
}

setupImages();
