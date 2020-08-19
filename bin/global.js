#!/usr/bin/env node
const mdLinks = require('../src/index');

const main = (args) => {
  if(args.length !== 3){
    console.info('Modo de empleo:')
    console.info('md-links <path-to-file>');
    return 'Something went wrong';
  }

  mdLinks(args[2]);
}

main(process.argv);