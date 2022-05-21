import excuses from "https://cdn.skypack.dev/excuses@1.0.0";

const randomQuote = () => excuses.developers.getRandom();


setInterval(() => {
  document.getElementById('quote').innerHTML = randomQuote();
}, 5000);
document.getElementById('quote').innerHTML = randomQuote();