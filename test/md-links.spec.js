const path = require('path');
const mdLinks = require('..');
const got = require('got');

jest.mock('got');

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

  it('should find and validate links in a single file', () => {
    // const newpath = path.join(__dirname, '/..');
    const newpath = path.join(__dirname, 'fixtures/example1.md');
    expect(mdLinks(newpath)).rejects.toThrow('error while processing all files');
  });

  it.only('should validate links in a directory', () => {
    https.__('https://es.wikipedia.org/wiki/Markdown', { statusCode: 200 });
    https.__('https://nodejs.org/es/', { statusCode: 200 });
    https.__('https://www.npmjs.com/', { statusCode: 200 });
    http.__('http://this-should-not-work.local/oh/my/god', new Error('OMG'));

    const newpath = path.join(__dirname, 'fixtures');
    const options = { validate: true };
    mdLinks(newpath)
      .then((links) => {
        console.log(links);
        expect(links.length).toBe(10);
      })
      .catch((err) => {
        expect(err.message).toBe('error');
      })
  });


  it('should ignore non-markdown files', () => {
    expect(mdLinks(path.join(fixtureDir, 'random-file'))).rejects.toThrow('Path is not a markdown fil');
  });

  it.skip('should find and validate links in a single file', () => { });
  it.skip('should recursively find and validate links in a dir', () => { });

});
