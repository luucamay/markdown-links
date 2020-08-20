#!/usr/bin/env node
const mdLinks = require('../src/index');

const main = (args) => {
  const numArgs = args.length;

  if (numArgs == 2) {
    console.info('Modo de empleo:')
    console.info('md-links <path-to-file> [options]');
    return 'Something went wrong';
  } else if (numArgs === 3) {
    mdLinks(args[2]);
  }

  const options = {
    validate: false
  }
  const validArguments = ['validate'];
  for (let i = 3; i < numArgs; i++) {
    const option = args[i].substring(2);
    if(!validArguments.includes(option)){
      console.log(`${option} is an invalid argument. You can use --validate and/or --stats`);
      return 'Something went wrong';
    }
    options[option] = true
  }

  mdLinks(args[2], options);
}

main(process.argv);