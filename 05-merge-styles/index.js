const fs = require('fs');
const {readdir} = require('fs');
const {readFile, appendFile, unlink} = require('fs/promises');
const path = require('path');

const pathFolder = path.join(__dirname, 'styles');
const pathCopyFolder = path.join(__dirname, 'project-dist');

fs.promises.readdir(pathCopyFolder)

.then(filenames => {
  for (let filename of filenames) {
    if (filename.toString() === 'bundle.css') {
      let folderFileDelete = path.join(pathCopyFolder, '\\', filename.toString());
      (async function (path) {
        try {
          await unlink(path);
        } catch (error) {
          console.error('there was an error:', error.message);
        }
      })(folderFileDelete);
    }
  }
})

.catch(err => {
  console.log(err)
})

readdir(
  pathFolder,
  (err, files) => {
    if (err) throw err;
    for (let filename of files) {
      if (filename.toString().split('.')[1] === 'css') {
        const fileStyle = readFile(
          path.join(pathFolder, filename),
          'utf8'
        );
        fileStyle.then((result) => {
          appendFile(pathCopyFolder + '\\' + 'bundle.css', '\n' + result);
        });
      }
    }
  });