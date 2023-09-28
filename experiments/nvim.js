const fileStructure = {
  node_modules: {
    'json-dsl': {
      'package.json': '// TODO Tom is a genious https://youtu.be/QwUPs5N9I6I',
    },
    leftpad: { 'package.json': '// TODO add leftpad' },
  },
  src: {
    'index.js':
      "// Run using :run\r\n\r\nconst message = 'Hello world!';\r\nalert(message);\r\n\r\nmessage;\r\n",
  },
  'package.json':
    '{\n  "name": "hello-world",\n  "version": "1.0.0",\n  "description": "The weirdest hello world ever",\n  "main": "index.js",\n  "scripts": {},\n  "keywords": [\n    "hello",\n    "world",\n    "helloworld",\n    "js"\n  ],\n  "author": "Tomate0613",\n  "license": "ISC"\n}\n',
  'README.md':
    "# 🔥🔥🔥🔥🔥🔥🔥🔥 Hello World 🔥🔥🔥🔥🔥🔥🔥🔥\r\nThis is a blazingly fast implementation of hello world in js\r\n\r\n## How to run the project\r\n\r\n#### Windows\r\n- Download git\r\n- Run `git clone https://virus.zip@github.com/Tomate0613/shit`\r\n- Install `npm`\r\n- Hmm, we need some *build tools*\r\n  - tsc\r\n  - vite\r\n  - webpack\r\n- Run `npm i`\r\n- Now comes the easy part\r\n- Setup a cpp compiler. Won't tell you how though\r\n- Magic\r\n- Give up\r\n- Try again\r\n- And there you go. You are done\r\n- Run :run\r\n\r\n### Linux\r\n- Run `:run`",
};

function treeFolder(name, item, path) {
  const folderWrapper = document.createElement('div');
  const folderInner = document.createElement('button');
  const folderContents = document.createElement('div');

  folderContents.classList.add('nvim-tree-folder-contents');

  folderInner.classList.add('nvim-tree-folder');
  folderInner.tabIndex = 0;
  folderInner.classList.add('nvim-tree-item');

  folderWrapper.classList.add('nvim-tree-folder-wrapper');
  folderWrapper.appendChild(folderInner);
  folderWrapper.appendChild(folderContents);
  let open = false;
  let initialized = false;

  folderInner.addEventListener('click', () => {
    open = !open;

    if (open) {
      if (!initialized) {
        tree(folderContents, item, path);
        initialized = true;
      }

      folderWrapper.classList.add('open');
    } else {
      folderWrapper.classList.remove('open');
    }
  });

  folderInner.innerText = name;

  return folderWrapper;
}

function treeFile(name, item, path) {
  const file = document.createElement('button');
  file.classList.add('nvim-tree-file');
  file.classList.add('nvim-tree-item');

  file.innerText = name;
  file.tabIndex = 0;

  file.addEventListener('click', () => {
    if (!titleBarEventEmitter.emit('activate', path))
      titlebarItemsNode.appendChild(titleBarItem(path));
  });

  return file;
}

function tree(node, tree, path) {
  const itemNames = Object.keys(tree);

  for (let i = 0; i < itemNames.length; i++) {
    const name = itemNames[i];
    const item = tree[name];
    const itemPath = path ? path + '/' + name : name;

    if (typeof item === 'string') {
      node.appendChild(treeFile(name, item, itemPath));
    } else {
      node.appendChild(treeFolder(name, item, itemPath));
    }
  }
}

const titleBarEventEmitter = new EventEmitter();

function titleBarItem(file) {
  let alive = true;

  const titleBarItem = document.createElement('button');
  const closeButton = document.createElement('button');

  closeButton.innerText = '';
  closeButton.classList.add('close');
  closeButton.addEventListener('click', () => {
    titleBarEventEmitter.emit('change-active', null);
    titleBarItem.remove();
    titleBarEventEmitter.removeListener('change-active', changeTabCallback);
    titleBarEventEmitter.removeListener('change', changeCallback);
    titleBarEventEmitter.removeListener('activate', activateCallback);
    alive = false;
  });

  titleBarItem.innerText = file.split('/').pop();
  titleBarItem.classList.add('nvim-titlebar-item');
  titleBarItem.appendChild(closeButton);

  titleBarItem.addEventListener('click', () => {
    if (!alive) return;

    titleBarEventEmitter.emit('change-active', file);
  });

  const changeTabCallback = (activeFile) => {
    if (activeFile === file) {
      titleBarItem.classList.add('active');
    } else {
      titleBarItem.classList.remove('active');
    }
  };

  const changeCallback = (isSaved) => {
    if (file !== currentFile) return;

    if (isSaved) {
      titleBarItem.classList.remove('changed');
      closeButton.innerText = '';
    } else {
      titleBarItem.classList.add('changed');
      closeButton.innerText = '';
    }
  };

  const activateCallback = (activeFile) => {
    if (activeFile !== file) return;

    titleBarEventEmitter.emit('change-active', file);
    return true;
  };

  titleBarEventEmitter.on('change-active', changeTabCallback);
  titleBarEventEmitter.on('change', changeCallback);
  titleBarEventEmitter.on('activate', activateCallback);

  titleBarEventEmitter.emit('change-active', file);

  return titleBarItem;
}

function initializeNvimTree() {
  const treeNode = document.getElementById('nvim-tree');
  tree(treeNode, fileStructure);
}

let titlebarItemsNode;

function initializeTitlebar() {
  titlebarItemsNode = document.getElementById('nvim-titlebar-items');
  // for (let i = 1; i <= 3; i++) {
  //   titlebarItemsNode.appendChild(titleBarFile(`test${i}.txt`))
  // }
}

function resolveFileContents(filepath, folder) {
  const [first, ...rest] = filepath.split('/');

  if (!folder) folder = fileStructure;

  if (typeof folder[first] === 'object') {
    return resolveFileContents(rest.join('/'), folder[first]);
  }

  return folder[first];
}

function setFileContents(data, filepath, folder) {
  const [first, ...rest] = filepath.split('/');

  if (!folder) folder = fileStructure;

  if (typeof folder[first] === 'object') {
    return setFileContents(data, rest.join('/'), folder[first]);
  }

  folder[first] = data;
}

let currentFile;
function inititalizeContent() {
  const contentNode = document.getElementById('nvim-content');

  contentNode.addEventListener('input', () => {
    titleBarEventEmitter.emit('change', false);
  });

  titleBarEventEmitter.on('change-active', (file) => {
    contentNode.innerHTML = '';
    currentFile = file;

    if (!file) return;

    resolveFileContents(file)
      .split('\n')
      .forEach((line) => {
        const lineElement = document.createElement('div');

        lineElement.innerText = line;

        contentNode.appendChild(lineElement);

        lineElement.addEventListener('change', () => {});
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeNvimTree();
  initializeTitlebar();
  inititalizeContent();

  setMode('normal');
});

let mode = 'normal';
let temp = '';

const commands = {
  ' e': () => {
    const treeNode = document.getElementById('nvim-tree');
    const buttonElement = treeNode.querySelector('button');

    buttonElement.focus();
  },
  i: () => {
    setMode('insert');
    const contentNode = document.getElementById('nvim-content');

    setTimeout(() => {
      contentNode.contentEditable = true;
      contentNode.focus();
    }, 1);
  },
  ':help': () => 'No help for you :ferris:',
  ':run': () => eval(fileStructure.src['index.js']),
  ':w': () => {
    const contentNode = document.getElementById('nvim-content');

    if (!currentFile) return 'No filename';

    setFileContents(
      contentNode.innerHTML
        .replaceAll('<br>', '')
        .replaceAll('<div>', '')
        .replaceAll('</div>', '\n'),
      currentFile
    );

    titleBarEventEmitter.emit('change', true);

    return `"${currentFile}" written`;
  },
  ':q': () => {
    // TODO close current file
  },
  ':q!': () => history.back(),
  ':qall': () => history.back(),
  ':qall!': () => history.back(),
};

function setMode(newMode) {
  mode = newMode;

  document.getElementById('nvim-s-mode-text').innerText = newMode.toUpperCase();
  document.getElementById('nvim-s-mode').className = mode;
}

function setNormal() {
  const contentNode = document.getElementById('nvim-content');

  contentNode.contentEditable = false;
  contentNode.blur();
  setMode('normal');
}

document.addEventListener('keydown', (event) => {
  let key = event.key;

  if (key === 'Tab' && mode === 'insert') {
    event.preventDefault();

    // TODO insert two spaces
  }

  if (key === ':' && mode === 'normal') setMode('command');

  if (key === 'Backspace' && mode === 'command') {
    temp = temp.slice(0, -1);

    if (temp.length < 1) setNormal();

    document.getElementById('nvim-commands').innerText = temp.replaceAll(
      ' ',
      '<20>'
    );
  }

  if (key == 'Enter' && temp) {
    key = '';
  }

  if (key == 'Escape') {
    setNormal();

    temp = '';
    document.getElementById('nvim-commands').innerText = '';
    return;
  }

  if (key === ':' && mode === 'normal') {
    setNormal();
    setMode('command');
  } else if (
    (key.length > 1 && !(key === 'Enter' && temp[0] === ':')) ||
    (temp.length === 0 &&
      !Object.keys(commands).find((command) => command[0] === key)) ||
    (mode !== 'normal' && mode !== 'command')
  )
    return;

  temp += key;

  document.activeElement.blur();

  if (commands[temp] && temp[0] !== ':') {
    commands[temp]();
    document.getElementById('nvim-commands').innerText = temp.replaceAll(
      ' ',
      '<20>'
    );
    temp = '';
    return;
  }

  if (temp[0] === ' ' && temp.length > 1) temp = '';

  if (event.key === 'Enter' && temp[0] === ':') {
    if (commands[temp]) {
      const output = commands[temp]();
      document.getElementById('nvim-commands').innerText = output;
      temp = '';
      setMode('normal');
      return;
    }

    document.getElementById(
      'nvim-commands'
    ).innerText = `Error: Invalid command: ${temp.slice(1)}`;
    temp = '';
    setMode('normal');
    return;
  }

  document.getElementById('nvim-commands').innerText = temp.replaceAll(
    ' ',
    '<20>'
  );
});
