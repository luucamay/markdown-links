const pathSytem = require('path');
const fs = require('fs');
const { promises: filesystem } = require("fs");
const marked = require('marked');
const readdirp = require('readdirp');
const got = require('got');

const convertToAbosulute = (pathToConvert) => {
  if (typeof pathToConvert !== 'string') {
    console.log('Path provided is not a string');
    return '';
  }

  const resolvedPath = pathSytem.resolve(pathToConvert);
  return resolvedPath;
}

const isFolder = (pathToCheck) => fs.lstatSync(pathToCheck).isDirectory();

const validateLinks = (linksObjArr) => {
  console.log('validating links...')
  return new Promise((fulfill, reject) => {
    const requests = linksObjArr.map((linkObj) => {
      const url = linkObj.href;
      return got(url)
        .then(response => {
          const statusCode = response.statusCode;
          let status = 'fail';
          if (statusCode === 200) {
            status = 'ok'
          }
          linkObj.statusCode = statusCode;
          linkObj.status = status;
          return linkObj;
        })
        .catch(error => {
          console.log(error.message);
          return error;
        });
    });

    Promise.all(requests)
      .then(fulfill)
      .catch(reject)
  })

}

const processMarkdownFile = (pathToRead, options = { validate: false }, linksArray = []) => {
  return new Promise((fulfill, reject) => {

    fs.readFile(pathToRead, (err, data) => {
      if (err) {
        console.error(err.message);
        console.error(`Sorry I can't read file: ${pathToRead}`);
        return reject(err);
      }
      getLinks(data.toString(), pathToRead, linksArray);

      if (options.validate) {
        return validateLinks(linksArray)
          .then(fulfill)
          .catch(reject);
      }

      fulfill(linksArray);
      // return mycallback(pathToRead, linksArray);
    });

  });

}

const getLinks = (markdownText, file, links = []) => {
  var renderer = new marked.Renderer();
  renderer.link = function (href, title, text) {
    if (!href.startsWith('#')) {
      links.push({ href, text, file });
    }
  };
  // here is where the marked functions creates an html file
  // from a markdown text and when it is rendering the links
  // it pushes them to my links array and place undefined in that place
  marked(markdownText, { renderer });
  return links;
}

const printResults = (pathName, linksArray) => {
  // pathName = pathSytem.basename(pathName);
  linksArray.forEach(linkObj => {
    const textTruncated = linkObj.text.substring(0, 50);
    console.log(pathName, linkObj.href, textTruncated);
  });
}

const getFiles = (path) => {
  return new Promise((resolveGetFiles, rejectGetFiles) => {
    const allFilePaths = []
    const settings = {
      fileFilter: '*.md',
      alwaysStat: true,
      directoryFilter: ['!.git', '!node_modules'],
    }
    readdirp(path, settings)
      .on('data', (entry) => {
        const filePath = entry.fullPath;
        allFilePaths.push(filePath);
      })
      // Optionally call stream.destroy() in `warn()` in order to abort and cause 'close' to be emitted
      .on('warn', error => console.error('non-fatal error', error))
      .on('error', error => {
        console.error('fatal error', error);
        rejectGetFiles(error);
      })
      .on('end', () => resolveGetFiles(allFilePaths));
  });
}

const processAllFiles = (allFiles, options = { validate: false }) => {
  // here allFiles is the first time you get an array of markdown files
  return new Promise((resolveProcessFiles, rejectProcessFiles) => {
    if (allFiles.length === 0) {
      const error = { 'message': 'There is no markdown files inside this folder' };
      return rejectProcessFiles(error);
    }
    const mdlinksObjectsArray = [];
    const processingFiles = allFiles.map(file => processMarkdownFile(file, options, mdlinksObjectsArray));

    Promise.all(processingFiles).then((filesobjects) => {
      // console.log(mdlinksObjectsArray);
      resolveProcessFiles(mdlinksObjectsArray)
    });
  });
}

const mdLinks = (path, options = { validate: false }) => {
  return new Promise((resolve, reject) => {
    console.log('Iniciando funcion mdLinks');

    console.log(`Getting absolute path ...`);
    path = convertToAbosulute(path);

    if (path === '') {
      console.log('Please use a valid path');
      reject('Invalid path');
    }

    console.info(`is ${path} file or folder?`);

    try {
      if (isFolder(path)) {
        console.log('path is a folder');
        getFiles(path)
          .then((arrayFilePaths) => {
            // console.log(arrayFilePaths);
            return processAllFiles(arrayFilePaths, options);
          })
          .then((mdLinksArray) => {
            console.log(mdLinksArray);
            resolve(mdLinksArray);
          });
      } else {
        if (!path.endsWith('.md')) {
          console.log("Sorry, I can't process a file with a extension different to .md")
          reject('Invalid extension');
        }

        // the next function resolves in the future
        processMarkdownFile(path, options)
          .then(linksArray => {
            console.log(linksArray);
            resolve(linksArray);
          })
          .catch(e => {
            reject(e);
          })
      }
    } catch (e) {
      console.error(e.message);
      console.info('Please provide a valid PATH');
      reject('PATH provided does not exist')
    }

  });

}

module.exports = mdLinks;
