const path = require('path');
const mdLinks = require('..');
const got = require('got');
const { link } = require('fs');

jest.mock('got', () => jest.fn((url) => {
  // create an object that has the url as a key and the statuscode as a value?
  if (url === 'http://this-should-not-work.local/oh/my/god')
    return Promise.reject(new Error('Link not reachable'))
  return Promise.resolve({ statusCode: 200 })
}));

describe('mdLinks', () => {
  const currentWorkingDirectory = process.cwd();
  const pathJoined = path.join(__dirname, 'fixtures');
  const fixtureDir = path.relative(currentWorkingDirectory, pathJoined);

  it.skip('should throw when path is not a string', () => {
    expect(mdLinks()).rejects.toThrow('The \"path\" argument must be of type string or an instance of Buffer or URL. Received undefined');
  });

  it.skip('should throw when path does not exist', () => {
    expect(mdLinks('foo')).rejects.toThrow('ENOENT');
  });

  it.skip('should find links in a single file', () => {
    mdLinks(path.join(fixtureDir, 'example1.md'))
      .then((links) => {
        expect(links.length).toBe(1);
        expect(links).toMatchSnapshot();
      })
  });

  it.skip('should recursively find links in a directory', () => (
    mdLinks(fixtureDir)
      .then((links) => {
        expect(links.length).toBe(10);
        expect(links).toMatchSnapshot();
      })
  ));

  it.skip('should find and validate links in a single file', () => {
    const newpath = path.join(__dirname, 'fixtures/example1.md');
    const options = { validate: true };
    return mdLinks(newpath, options)
      .then((links) => {
        expect(links.length).toBe(1);
        expect(got).toHaveBeenCalledTimes(1);
      })
      .catch((err) => {
        expect(err.message).toBe('error');
      })
  });


  it.skip('should find and validate links in another single file', () => {
    got.mockClear();
    const newpath = path.join(__dirname, 'fixtures/example2.md');
    const options = { validate: true };
    return mdLinks(newpath, options)
      .then((links) => {
        expect(links.length).toBe(4);
        expect(got).toHaveBeenCalledTimes(4);
      })
  });

  it.skip('should find and validate links in a directory', () => {
    got.mockClear();
    const newpath = path.join(__dirname, 'fixtures');
    const options = { validate: true };
    return mdLinks(newpath, options)
      .then((links) => {
        const total = 10;
        expect(links.length).toBe(total);
        expect(got).toHaveBeenCalledTimes(total);
      })
  });


  it('should ignore non-markdown files', () => {
    expect(mdLinks(path.join(fixtureDir, 'random-file'))).rejects.toThrow('Path is not a markdown file');
  });

});
