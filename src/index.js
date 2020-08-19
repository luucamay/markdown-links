const pathSytem = require('path');
const fs = require('fs');
const marked = require('marked');

const isAbsolutePath = (pathToCheck) => {
  const resolvedPath = pathSytem.resolve(pathToCheck);
  const normalizedPath = pathSytem.normalize(pathToCheck);
  return resolvedPath === normalizedPath;
}

const convertToAbosulute = (pathToConvert) => {
  const resolvedPath = pathSytem.resolve(pathToConvert);
  return resolvedPath;
}

const isFolder = (pathToCheck) => fs.lstatSync(pathToCheck).isDirectory();

const processMarkdownFile = (pathToRead, mycallback) => {
  console.log('Processing markdown file...');
  fs.readFile(pathToRead, (err, data) => {
    if (err) {
      console.error(err.message);
      console.error(`Sorry I can't read file: ${pathToRead}`);
    }
    const linksArray= getLinks(data.toString());
    //console.log(linksArray);
    return mycallback(pathToRead, linksArray);
  })
}

const getLinks = (markdownText) => {
  var links = [];
  var renderer = new marked.Renderer();
  renderer.link = function (href, title, text) {
    links.push({href, text});
  };
  // here is where the marked functions creates an html file
  // from a markdown text and when it is rendering the links
  // it pushes them to my links array and place undefined in that place
  marked(markdownText, { renderer });
  return links;
}

const printResults = (pathName, linksArray) => {
  pathName = pathSytem.basename(pathName);
  linksArray.forEach(linkObj => {
    const textTruncated =  linkObj.text.substring(0, 50);
    console.log(pathName, linkObj.href, textTruncated);
  });
  console.log('Finishing function :)');
}

const mdLinks = (path) => {
  console.log('iniciando funcion mdLinks');
  console.log(`Getting absolute path of ${path}...`);

  if (!isAbsolutePath(path)) {
    path = convertToAbosulute(path);
  }

  console.info(`is ${path} file or folder?`);
  try {
    if (isFolder(path)) {
      console.log('path is a folder');
    } else {
      if (path.slice(-2) !== 'md') {
        console.log("Sorry, I can't process a file with a extension different to .md")
        return 'error code?';
      } else {
        // the next function resolves in the future
        processMarkdownFile(path, printResults);
      }
    }
  } catch (e) {
    console.error(e.message);
    console.info('Please provide a valid PATH');
    return 'Error code?';
  }
  return 'Success code?';
}

module.exports = mdLinks;
