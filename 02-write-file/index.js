const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;

fs.writeFile(
  path.join(__dirname, 'text02.txt'),
  '',
  (err) => {
    if (err) throw err;
  }
);

stdout.write('Введите, пожалуйста, любой текст:\n');
stdin.on('data', data => {
  const newText = data.toString();

  if (newText.includes('exit')){
    // console.log('Good Luck');
    exit();
  } else {
    fs.appendFile(
      path.join(__dirname, 'text02.txt'),
      newText,
      err => {
        if (err) throw err;
      }
    );
  }
});
process.on('exit', () => stdout.write('Удачи и до свидания!'));
process.on('SIGINT', () => {
  process.exit();
});