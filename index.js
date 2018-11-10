const fs = require("fs");
const { join } = require("path");
const inquirer = require("inquirer");

//FIgure out the new default

function load() {
  const homefile = join(process.env.HOME, "/.rninfo");
  var homeinfo;
  if (fs.existsSync(homefile)) {
    homeinfo = JSON.parse(fs.readFileSync(homefile));
  } else {
    homeinfo = {};
  }
}
function save(homeinfo) {
  const homefile = join(process.env.HOME, "/.rninfo");
  fs.writeFileSync(homefile, JSON.stringify(homeinfo));
}

async function get(key, question, validator = Boolean) {
  const o = load();
  if (validator[key] !== true) {
    if (question) {
      try {
        const { key: value } = await inquirer.prompt([
          {
            message: question,
            name: key,
            validate: validator
          }
        ]);
        o[key] = value;
        save(o);
        return value;
      } catch (e) {
        return false;
      }
    } else return false;
  }
}
module.exports = {
  load,
  save,
  get
};
