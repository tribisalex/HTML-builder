const fs = require('fs');
const path = require('path');
const {readdir} = require('fs');
const fsPromises = require('fs/promises');
const {readFile, appendFile} = require('fs/promises');

const projectDistFolder = path.join(__dirname, 'project-dist');
const pathFolder = path.join(__dirname, 'styles');
const pathAssets = path.join(__dirname, 'assets');
const pathAssetsTarget = path.join(projectDistFolder, 'assets');
const pathTemplate = path.join(__dirname, 'template.html');
const pathIndex = path.join(projectDistFolder, 'index.html');
const pathComponents = path.join(__dirname, 'components');

async function buildPage() {
  await fsPromises.mkdir(projectDistFolder, {recursive: true})

  .then(() => {
    async function createTemplate() {
      let componentsArr = ['{{header}}', '{{articles}}', '{{footer}}'];
      readdir(
        pathComponents,
        (err, files) => {
          if (err) throw err;
          for (let filename of files) {
            componentsArr.push('{{' + filename.split('.')[0].toString() + '}}');
          }
        });
      let template = await fsPromises.readFile(pathTemplate, 'utf8');
      for await (const component of componentsArr) {
        const compName = component.slice(2, -2);
        const compLayout = await fsPromises.readFile(path.join(pathComponents, `${compName}.html`), 'utf8');
        template = template.replace(component, compLayout);
      }
      await fsPromises.writeFile(pathIndex, template, 'utf8');
    }

    createTemplate()
  })

  .then(() => {
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
              appendFile(projectDistFolder + '\\' + 'style.css', '\n' + result);
            });
          }
        }
      });
  })

  .then(() => {
    function copiedAssets(inputFolder, outputFolder) {
      fs.readdir(
        inputFolder,
        {withFileTypes: true},
        (err, files) => {
          if (err) console.error(err.message);
          files.forEach(file => {
            if (file.isDirectory()) {
              fs.rm(
                outputFolder + '/' + file.name.toString(),
                {recursive: true, force: true},
                (err) => {
                  if (err) console.error(err.message);
                  fs.mkdir(outputFolder + '/' + file.name.toString(), {recursive: true}, (err) => {
                    if (err) console.error(err.message);
                    copiedAssets(inputFolder + '/' + file.name.toString(), outputFolder + '/' + file.name);
                  });
                });
            } else {
              fs.copyFile(
                inputFolder + '/' + file.name.toString(),
                outputFolder + '/' + file.name.toString(),
                (err) => {
                  if (err) console.error(err.message);
                });
            }
          })
        });
    }

    copiedAssets(pathAssets, pathAssetsTarget)
  })

  .catch(err => console.error(err.message));
}

fsPromises.rm(
  projectDistFolder,
  {recursive: true, force: true})
.then(() => {
  buildPage()
  .then(err => {
    if (err) console.error(err);
  });
});