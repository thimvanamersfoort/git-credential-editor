#!/usr/bin/env node

const prompts = require('prompts');
const urlParser = require('url-parse');
const fs = require('fs/promises');
const git_shell = require('./controllers/git_shell');


(async () => {

  var _data = await fs.readFile('./access.json', 'utf-8');
  var data = JSON.parse(_data);

  var questions = data.map((orig) => {
    return {
      title: orig.username,
      description: `Email: ${orig.email}`,
      value: orig.username
    }
  });

  var response = await prompts({
    type: 'select',
    name: 'value',
    hint: 'Make sure the credentials are saved in "./access.json"',
    message: 'Pick a username',
    choices: questions,
    initial: 0
  });

  console.log(response);


})();
