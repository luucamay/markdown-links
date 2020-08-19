const pathSytem = require('path');
const fs = require('fs');

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

const mdLinks = (path) => {
  console.log('iniciando funcion mdLinks');
  console.log(`Getting absolute path of ${path}...`);

  if(!isAbsolutePath(path)){
    path = convertToAbosulute(path);
  }

  console.info(`is ${path} file or folder?`);
  try {
    if(isFolder(path)){
      console.log('path is a folder');
    } else {
      if(path.slice(-2) !== 'md'){
        console.log("Sorry, I can't process a file with a extension different to .md")
        return 'error code?';
      } else {
        console.log('Processing markdown file...');
      }
    }
  } catch (e) {
    console.error(e.message);
    console.info('Please provide a valid PATH');
    return 'Error code?';
  }

  console.log('finishing md-links function');
  return 'Success code?';
}

module.exports = mdLinks;
