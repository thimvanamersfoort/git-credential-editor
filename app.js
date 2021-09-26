#!/usr/bin/env node

const prompts = require('prompts');
const Url = require('url-parse');
const fs = require('fs/promises');
const shell = require('shelljs');


(async () => {

  // get data and map accordingly
  var _data = await fs.readFile('./access.json', 'utf-8');
  var data = JSON.parse(_data);

  var questions = data.map((orig) => {
    return {
      title: orig.username,
      description: `Email: ${orig.email}`,
      value: orig.username
    }
  });

  // get response to what user to change to
  var response = await prompts({
    type: 'select',
    name: 'value',
    hint: 'Make sure the credentials are saved in "./access.json"',
    message: 'Pick a username',
    choices: questions,
    initial: 0
  });

  var user = data.find(user => user.username === response.value);
  if(!user) throw new Error('User undefined [Line: 34]');

  /*
    To-Do:
    3. link parsen
    4. wincred_manager package implementeren via npm
  */

  var remoteName = shell.exec('git remote', {silent: true}).stdout.replace('\n', '');
  var remoteUrl = shell.exec(`git config --get remote.${remoteName}.url`, {silent: true}).stdout.replace('\n', '');
  if(!remoteName || !remoteUrl) throw new Error('Git remote info not found [Line: 47]');

  var remoteUrlWithAuth = new Url(remoteUrl).set('username', user.username).toString();
  console.log([remoteUrl, remoteUrlWithAuth]);


})();
