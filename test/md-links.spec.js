const path = require('path');
const mdLinks = require('..');
const { link } = require('fs');


describe('mdLinks', () => {
  const currentWorkingDirectory = process.cwd();
  const pathJoined = path.join(__dirname, 'fixtures');
  const fixtureDir = path.relative(currentWorkingDirectory, pathJoined);

  it('should throw when path is not a string', () => {
    expect(mdLinks()).rejects.toThrow('The \"path\" argument must be of type string or an instance of Buffer or URL. Received undefined');
  });

  it('should throw when path does not exist', () => {
    expect(mdLinks('foo')).rejects.toThrow('ENOENT');
  });

  it('should find links in a single file', () => {
    mdLinks(path.join(fixtureDir, 'example1.md'))
      .then((links) => {
        expect(links.length).toBe(1);
        expect(links).toMatchSnapshot();
      })
  });

  it('should recursively find links in a directory', () => (
    mdLinks(fixtureDir)
      .then((links) => {
        expect(links.length).toBe(10);
        expect(links).toMatchSnapshot();
      })
  ));

  it.skip('should ignore non-markdown files', () => { });
  it.skip('should find links in a single file', () => { });
  it.skip('should recursively find links in a directory', () => { });
  it.skip('should find and validate links in a single file', () => { });
  it.skip('should recursively find and validate links in a dir', () => { });

});
