const path = require('path');
const mdLinks = require('..');
const { link } = require('fs');


describe('mdLinks', () => {
  const currentWorkingDirectory = process.cwd();
  const pathJoined = path.join(__dirname, 'fixtures');
  const fixtureDir = path.relative(currentWorkingDirectory, pathJoined);

  it('should throw when path is not a string', () => {
    expect(mdLinks()).rejects.toThrow('Argument must be type string');
  });

  it('should throw when path does not exist', () => {
    expect(mdLinks('foo')).rejects.toThrow('ENOENT');
  });

  it('should find links in a single file', () => {
    mdLinks(path.join(fixtureDir, 'example1.md'))
      .then((links) => {
        console.log(links.length);
        console.log(links);
      })
  })

});
