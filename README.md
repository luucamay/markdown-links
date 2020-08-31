# markdown-links
A npm package that checks links inside a markdown file

## Install
    $ npm install https://github.com/luucamay/markdown-links

## Use the module
    const mdLinks = require("markdown-links");

    // get array of objects where each object looks like { href, link, file }
    mdLinks("./some/example.md")
      .then(links => {
        // => [{ href, text, file }]
      })
      .catch(console.error);

    // use it with a directory path
    mdLinks("./some/dir")
      .then(links => {
        // => [{ href, text, file }]
      })
      .catch(console.error);

    // add options to validate the links found
    mdLinks("./some/example.md", { validate: true })
      .then(links => {
        // => [{ href, text, file, status, ok }]
      })
      .catch(console.error);

## Use the cli
Get filename, link reference and link text
```sh
$ md-links ./some/example.md
./some/example.md http://algo.com/2/3/ Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html algún doc
./some/example.md http://google.com/ Google
```

### Options
Use the ```--validate``` argument to validate the links
```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```

If you pass the argument ```--stats``` the output should return stadistics about the links found
```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

You can also combine ```--stats``` and ```--validate``` to get stadistics about validation results
```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```

## Author

[@luucamay](https://github.com/luucamay "luucamay's repository")