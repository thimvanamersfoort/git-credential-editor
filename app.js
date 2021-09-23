#!/usr/bin/env node

const prompts = require('prompts');
const urlParser = require('url-parse');
const fs = require('fs');
const git_shell = require('./controllers/git_shell');

let git = new git_shell();

fs.readFile('./access.json', 'utf-8', (err, contents) => {
  if(err) throw new Error(err.message);

  // get user data and map to new array to use in questions
  var data = JSON.parse(contents);
  var questions = data.map((orig) => {
    return {
      title: orig.username,
      value: orig.username
    }
  });

  // Get username to change
  var response;
  (async () => {
    response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Pick a username',
      choices: questions,
      initial: 1
    });

    console.log(response);
  })();
  

})

