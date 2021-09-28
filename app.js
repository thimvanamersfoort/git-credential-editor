#!/usr/bin/env node

const prompts = require('prompts');
const Url = require('url-parse');
const fs = require('fs/promises');
const shell = require('shelljs');
const Powershell = require('node-powershell');
const cred_helper = require('./credential_helper');

(async () => {
  try{

    // get data and map accordingly
    var data = await fs.readFile('./access.json', 'utf-8');
    data = JSON.parse(data);

    var _choices = data.map((orig) => {
      return {
        title: orig.username,
        description: `Email: ${orig.email}`,
        value: orig.username
      }
    });
    var questions = [
    {
      type: 'select',
      name: 'selected',
      hint: 'Make sure the credentials are saved in "./access.json"',
      message: 'Pick username currently selected for this git repo',
      choices: _choices,
      initial: 0
    }, 
    {
      type: 'select',
      name: 'desired',
      hint: 'Make sure the credentials are saved in "./access.json"',
      message: 'Pick username you want to change to',
      choices: _choices,
      initial: 0
    }];

    // get response to what user to change to
    var response = await prompts(questions);


    // get desired + selected user from script
    const DESIRED_USER = data.find(user => user.username === response.desired);
    if(!DESIRED_USER) throw new Error('Desired User undefined [Line: 48]');

    const SELECTED_USER = data.find(user => user.username === response.selected);
    if(!SELECTED_USER) throw new Error('Selected User undefined [Line: 51]');

    // check if git remote is found --> and configure git remote name and links
    var remoteName = shell.exec('git remote', {silent: true}).stdout.replace('\n', '');
    var remoteUrl = shell.exec(`git config --get remote.${remoteName}.url`, {silent: true}).stdout.replace('\n', '');
    if(!remoteName || !remoteUrl) throw new Error('Git remote info not found [Line: 56]');

    const remoteUrlWithAuthSelected = new Url(remoteUrl).set('username', SELECTED_USER.username).toString();
    const remoteUrlWithAuthDesired = new Url(remoteUrl).set('username', DESIRED_USER.username).toString();

    console.table({
      "Remote Name": remoteName,
      "Remote URL": remoteUrl,
      "Selected remote URL with Auth": remoteUrlWithAuthSelected,
      "Desired remote URL with Auth": remoteUrlWithAuthDesired
    });

    // try to get wincred manager results and remove them
    console.log('\n-----> REMOVING OLD USERS FROM Wincred_MGR <-----');
    console.log("Notice: If old creds can't be found, they will be overwritten with current credentials.");

    var result = await cred_helper.getCredential("git:" + remoteUrl);
    var resultWithAuth = await cred_helper.getCredential("git:" + remoteUrlWithAuthSelected);

    if(result) {
      var remove = await cred_helper.removeCredential(result.TargetName);
      if(remove)
        console.log(`\nTry to remove credentials from target: ${result.TargetName}`);
        console.log(`Msg from Wincred_MGR: ${remove}`);
    }
    if(resultWithAuth){
      var removeWithAuth = await cred_helper.removeCredential(resultWithAuth.TargetName);
      if(removeWithAuth)
        console.log(`\nTry to remove credentials from target: ${resultWithAuth.TargetName}`);
        console.log(`Msg from Wincred_MGR: ${removeWithAuth}`);
    }

    // add new credential info to wincred manager
    var newCred = await cred_helper.newCredential("git:" + remoteUrl, DESIRED_USER.username, DESIRED_USER.password);
    var newCredWithAuth = await cred_helper.newCredential("git:" + remoteUrlWithAuthDesired, DESIRED_USER.username, DESIRED_USER.password);

    if(newCred) 
      newCred = JSON.parse(newCred);
      console.log('\n -----> CREATED NEW USER <-----');
      console.log(`Msg from Wincred_MGR: ${newCred.UserName} ${newCred.Comment}`);

    if(newCredWithAuth)
      newCredWithAuth = JSON.parse(newCredWithAuth);
      console.log('\n -----> CREATED NEW USER WITH AUTH <-----');
      console.log(`Msg from Wincred_MGR: ${newCred.UserName} ${newCred.Comment}`);

    var commitChange = cred_helper.changeCommitName(DESIRED_USER.username, DESIRED_USER.email);
    if(commitChange == true) console.log('\n -----> GIT CONFIG VALUES CHANGED <-----')
    else console.log('\n -----> ERROR CHANGING GIT CONFIG VALUES <-----')

  }
  catch(err){
    console.log(`\nERROR: ${err.message}\n`);
    process.exit();
  }
})();
