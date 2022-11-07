function copyDir() {

const fs = require('fs');
const path = require('path');
const {unlink} = require('fs/promises');

  const pathFolder = path.join(__dirname, 'files');
  const pathCopyFolder = path.join(__dirname, 'files-copy');

  fs.promises.readdir(pathCopyFolder)

  .then(filenames => {
    for (let filename of filenames) {
      let folderFileDelete = path.join(pathCopyFolder, '\\', filename.toString());
      (async function (path) {
        try {
          await unlink(path);
        } catch (error) {
          console.error('there was an error:', error.message);
        }
      })(folderFileDelete);
    }
  })

  .catch(err => {
    console.log(err)
  })

  fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, err => {
    if (err) throw err;
  });

  fs.readdir(
    pathFolder,
    {withFileTypes: true},
    (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        let pathFile = pathFolder + '\\' + file.name.toString();
        let pathCopyFile = pathCopyFolder + '\\' + file.name.toString();
        fs.copyFile(pathFile, pathCopyFile, err => {
          if (err) throw err;
        });
      })
    }
  );
}

copyDir();