const fs = require('fs');
const { dirname: pathDirname, join } = require('path');
const bcrypt = require('bcrypt');


const filename = __filename;
const dirName = pathDirname(filename);

async function readFile(file) {
  try {
    let readFilename = join(dirName, file);
    console.log("readfile", readFilename);
    let result = await fs.promises.readFile(join(dirName, file), "utf-8");
    let data = await JSON.parse(result);
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function writeFile(file, data) {
  try {
    await fs.promises.writeFile(join(dirName, file), JSON.stringify(data));
    return true;
  } catch (err) {
    console.log(err);
  }
};

async function deleteFile(file) {
  try {
    await fs.promises.unlink(join(dirName, file));
    return true;
  } catch (err) {
    console.log(err);
  }
};

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (savedPassword, password) => {
  console.log(savedPassword);
  console.log(bcrypt.hashSync(password, bcrypt.genSaltSync(10)));

  return bcrypt.compareSync(password, savedPassword);
};

module.exports = { createHash, isValidPassword, readFile, writeFile, deleteFile, filename, dirName };
