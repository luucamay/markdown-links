const pathSytem = require('path');

const isAbsolutePath = (pathToCheck) => {
  const resolvedPath = pathSytem.resolve(pathToCheck);
  const normalizedPath = pathSytem.normalize(pathToCheck);
  console.log('resolved: ', resolvedPath, ' normalized: ', normalizedPath);
  return resolvedPath === normalizedPath;
}

const convertToAbosulute = (pathToConvert) => {
  const resolvedPath = pathSytem.resolve(pathToConvert);
  return resolvedPath;
}

const mdLinks = (path) => {
  console.log('iniciando funcion mdLinks');
  console.log(`Checking if ${path} is an absolute path...`);

  if(!isAbsolutePath(path)){
    absolutePath = convertToAbosulute(path);
  } else {
    absolutePath = path;
  }

  console.info(`is ${absolutePath} valid?`);

  return 'Success code?';
}

module.exports = mdLinks;
