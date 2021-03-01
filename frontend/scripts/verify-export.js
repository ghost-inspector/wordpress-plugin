const fs = require('fs')
const unzip = require('unzipper')
const path = require('path')

const main = () => {
  let expectedFilenames = [
    'ghost-inspector/ghost-inspector.css',
    'ghost-inspector/ghost-inspector.js',
    'ghost-inspector/ghost-inspector.php',
    'ghost-inspector/LICENSE.txt',
    'ghost-inspector/README.txt',
  ]
  fs.createReadStream(path.join(__dirname, '../../ghost-inspector.zip'))
    .pipe(unzip.Parse())
    .on('entry', (entry) => {
      expectedFilenames = expectedFilenames.filter(expected => expected !== entry.path)
      entry.autodrain()
    })
    .on('finish', () => {
      if (expectedFilenames.length > 0) {
        throw new Error(`missing files: ${expectedFilenames.join(', ')}`)
      } else {
        console.log('All expected files are present in ghost-inspector.zip')
        process.exit()
      }
    })
}

main()