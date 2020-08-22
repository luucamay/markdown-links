#!/usr/bin/env node
const mdLinks = require('../src/index');

const cliPrintResults = (linksArray, options = {}) => {
  const { validate } = options;
  
  linksArray.forEach(linkElement => {
    if(validate)
      console.log(linkElement.file, linkElement.href, linkElement.status, linkElement.statusCode, linkElement.text);
    else
      console.log(linkElement.file, linkElement.href, linkElement.text);
  });
}

const main = (args) => {
  const numArgs = args.length;

  if (numArgs == 2) {
    console.info('Modo de empleo:')
    console.info('md-links <path-to-file> [options]');
    return 'Something went wrong';
  } else {
    const options = {}
    
    const validArguments = ['validate'];
    for (let i = 3; i < numArgs; i++) {
      const option = args[i].substring(2);
      if (!validArguments.includes(option)) {
        console.log(`${option} is an invalid argument. You can use --validate and/or --stats`);
        return 'Something went wrong';
      }
      options[option] = true;
    }

    mdLinks(args[2], options)
      .then((data) => {
        console.log('success, promise fulfilled');
        // console.log(data);
        cliPrintResults(data, options);
      })
      .catch(e => {
        console.log('An error occured while executing the mdLinks function. More details: ');
        console.log(e.message)
      });
  }

}

main(process.argv);