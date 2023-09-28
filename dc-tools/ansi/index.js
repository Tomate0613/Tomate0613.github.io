const ANSI_NORMAL = '[0m';

const COLORS = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
];

const data = [];

const format = (color) => {
  return `[${color}m`;
};

const colorFg = (color) => {
  return COLORS.indexOf(color) + 30;
};

const colorBg = (color) => {
  return COLORS.indexOf(color) + 40;
};

const buildButtons = () => {
  const fg = document.getElementById('fg');
  const bg = document.getElementById('bg');

  COLORS.forEach((colorId) => {
    const _fg = colorFg(colorId);
    const _bg = colorBg(colorId);

    const fgButton = document.createElement('button');
    fgButton.className = `ansi-${_fg}`;
    fgButton.addEventListener('click', () => {
      // Get the current selection
      const selection = window.getSelection();

      // Check if the selection is not empty
      if (selection.rangeCount > 0) {
        // Get the range object for the selection
        const range = selection.getRangeAt(0);

        // Create a span element
        const selectedContent = range.extractContents();
        const spans = selectedContent.querySelectorAll('span');

        spans.forEach((span) => {
          COLORS.forEach((color) => {
            const className = `ansi-fg-${colorFg(color)}`;
            span.classList.remove(className);
          });
        });

        // Create a span element
        const span = document.createElement('span');
        span.classList.add(`ansi-fg-${_fg}`);

        // Insert the span element and the selected content back into the document
        span.appendChild(selectedContent);
        range.insertNode(span);
      }
    });
    fg.appendChild(fgButton);

    const bgButton = document.createElement('button');
    bgButton.className = `ansi-${_bg}`;
    bgButton.addEventListener('click', () => {
      // Get the current selection
      const selection = window.getSelection();

      // Check if the selection is not empty
      if (selection.rangeCount > 0) {
        // Get the range object for the selection
        const range = selection.getRangeAt(0);

        // Create a span element
        const selectedContent = range.extractContents();
        const spans = selectedContent.querySelectorAll('span');

        spans.forEach((span) => {
          COLORS.forEach((color) => {
            const className = `ansi-${colorBg(color)}`;
            span.classList.remove(className);
          });
        });

        // Create a span element
        const span = document.createElement('span');
        span.classList.add(`ansi-${_bg}`);

        // Insert the span element and the selected content back into the document
        span.appendChild(selectedContent);
        range.insertNode(span);
      }
    });
    bg.appendChild(bgButton);
  });

  const clearButton = document.createElement('button');
  clearButton.className = `ansi-clear`;
  clearButton.addEventListener('click', () => {
    const selection = window.getSelection();
    const text = window.getSelection().toString();

    const span = document.createElement('span');
    span.innerText = text;
    span.classList.add(`ansi-clear`);

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);

    range.selectNodeContents(span);
  });
  document.getElementById('cls').appendChild(clearButton);

  const EFFECTS = [2, 4];
  EFFECTS.forEach((effect) => {
    const effectButton = document.createElement('button');
    effectButton.innerText = effect;
    effectButton.className = `ansi-${effect}`;
    effectButton.addEventListener('click', () => {
      // Get the current selection
      const selection = window.getSelection();

      // Check if the selection is not empty
      if (selection.rangeCount > 0) {
        // Get the range object for the selection
        const range = selection.getRangeAt(0);

        // Create a span element
        const selectedContent = range.extractContents();

        // Create a span element
        const span = document.createElement('span');
        span.classList.add(`ansi-${effect}`);

        // Insert the span element and the selected content back into the document
        span.appendChild(selectedContent);
        range.insertNode(span);
      }
    });
    document.getElementById('effects').appendChild(effectButton);
  });
};

const parseAnsi = (node, oldState) => {
  let ansi = '';
  let newState = '';

  if (node.nodeName === '#text') {
    ansi = node.nodeValue;
  }

  if (node.nodeName === 'BR') {
    ansi = '\n';
  }

  node.childNodes.forEach((child) => {
    if (child.className) {
      const ansiCode = child.className.match(/\d+/g);
      if (ansiCode) {
        ansi += format(ansiCode[0]);
        newState = format(ansiCode[0]);
      } else {
        ansi += ANSI_NORMAL;
        newState = ANSI_NORMAL;
      }
    }

    ansi += parseAnsi(child, newState);
    if (child.nodeValue) {
      ansi += ANSI_NORMAL;
    }
    ansi += oldState;
  });

  return ansi;
};

const generateAnsi = () =>
  parseAnsi(document.getElementById('ansi'), ANSI_NORMAL);

const copyAnsi = () =>
  navigator.clipboard.writeText(`\`\`\`ansi\n${generateAnsi()}\n\`\`\``);

buildButtons();
