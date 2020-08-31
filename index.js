const fs = require('fs');
const marked = require('marked');
const readdirp = require('readdirp');
const got = require('got');

const getStatus = (statCode) => {
  const numDigits = statCode.toString().length;
  if (numDigits !== 3)
    return 'not valid status code';

  if (statCode >= 200 && statCode < 400)
    return 'ok';

  return 'fail';
}

const isFolder = (pathToCheck) => fs.lstatSync(pathToCheck).isDirectory();

const validateLink = (linkObj) =>
    got(linkObj.href)
      .then(response => {
        const statusCode = response.statusCode;
        linkObj.statusCode = statusCode;
        linkObj.status = getStatus(statusCode);
        return linkObj;
      })
      .catch(error => {
        let statusCode = error.response ? error.response.statusCode : 0;
        linkObj.statusCode = statusCode;
        linkObj.status = getStatus(statusCode);
        return linkObj;
      });

const processMarkdownFile = (pathToRead) => {
  return new Promise((fulfill, reject) => {
    fs.readFile(pathToRead, (err, data) => {
      if (err) {
        return reject(err);
      }
      const linksArray = getLinks(data.toString(), pathToRead);
      fulfill(linksArray)
    });
  });
}

const getLinks = (markdownText, file) => {
  const links = [];
  var renderer = new marked.Renderer();
  renderer.link = function (href, title, text) {
    if (!href.startsWith('#')) {
      text = text.substring(0, 50);
      links.push({ href, text, file });
    }
  };
  // here is where the marked functions creates an html file
  // from a markdown text and when it is rendering the links
  // it pushes them to my links array and place undefined in that place
  marked(markdownText, { renderer });
  return links;
}

const getFiles = (path) => {
  const allFilePaths = [];

  const settings = {
    fileFilter: '*.md',
    alwaysStat: true,
    directoryFilter: ['!.git', '!node_modules'],
  }

  return readdirp.promise(path, settings)
    .then(fileObjects => fileObjects.map(file => file.fullPath))

}

const processAllFiles = (allFiles) => {
  // here allFiles is the first time you get an array of markdown files
  return new Promise((resolveProcessFiles, rejectProcessFiles) => {
    if (allFiles.length === 0) {
      return rejectProcessFiles(new Error('There is no markdown files inside this folder'));
    }

    const processingFiles = allFiles.map(filePath => {
      return processMarkdownFile(filePath)
        .catch((err) => {
          console.log(`Can't access ${filePath}, please check it later`);
          console.log(err);
          return [];
        });
    });

    Promise.all(processingFiles)
      .then((arrayOfArrays) => {
        const mdlinksObjectsArray = arrayOfArrays.flat();
        if (mdlinksObjectsArray.length === 0)
          rejectProcessFiles(new Error('Any file has not been posbile to read'));
        resolveProcessFiles(mdlinksObjectsArray);
      })
  });
}

const mdLinks = (path, options = {}) =>
  new Promise((resolve, reject) => {
    // process path
    if (isFolder(path)) {
      getFiles(path)
        .then(processAllFiles)
        .then((linksArray) => {
          if (options.validate) {
            const linkStatusArr = linksArray.map(validateLink)
            return Promise.all(linkStatusArr).then(resolve);
          }
          return resolve(linksArray);
        })
        .catch(reject);
    } else {
      if (path.endsWith('.md')) {
        processMarkdownFile(path)
          .then(linksArray => {
            if (options.validate) {
              const linkStatusArr = linksArray.map(validateLink)
              return Promise.all(linkStatusArr).then(resolve);
            }
            return resolve(linksArray);
          })
          .catch(reject)
      } else
        reject(new Error("Path is not a markdown file"));
    }
  });


module.exports = mdLinks;
