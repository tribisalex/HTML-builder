const fs = require('fs');
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');
fs.readdir(
  pathFolder,
  {withFileTypes: true},
  (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (file.isFile()) {
        let pathFile = path.join(pathFolder,file.name.toString());
        fs.stat(pathFile, (err, stats) => {
          let fileSize = stats.size / 1024 + 'kb';
          let fileName = file.name.toString().split('.')[0];
          let fileExe = file.name.toString().split('.')[1];
          console.log(fileName + ' - ' + fileExe + ' - ' + fileSize);
        });
      }
    })
  }
);