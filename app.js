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
    if(!DESIRED_USER) throw new Error('Desired User undefined [Line: 49]');

    const SELECTED_USER = data.find(user => user.username === response.selected);
    if(!SELECTED_USER) throw new Error('Selected User undefined [Line: 52]');

    // check if git remote is found --> and configure git remote name and links
    var remoteName = shell.exec('git remote', {silent: true}).stdout.replace('\n', '');
    var remoteUrl = shell.exec(`git config --get remote.${remoteName}.url`, {silent: true}).stdout.replace('\n', '');
    if(!remoteName || !remoteUrl) throw new Error('Git remote info not found [Line: 47]');

    const remoteUrlWithAuthSelected = new Url(remoteUrl).set('username', SELECTED_USER.username).toString();
    const remoteUrlWithAuthDesired = new Url(remoteUrl).set('username', DESIRED_USER.username).toString();

    console.log([remoteUrl, remoteUrlWithAuthSelected, remoteUrlWithAuthDesired]);
    
    /*
      1. Check of git remote authentication aanwezig is
      als aanwezig is
        --> verwijder alle storedCreds
        --> maak nieuwe storedCreds
      als niet aanwezig is
        --> maak nieuwe storedCreds
    */

    // get wincred manager results
    var result = await cred_helper.getCredential("git:" + remoteUrl);
    var resultWithAuth = await cred_helper.getCredential("git:" + remoteUrlWithAuthSelected);

    if(result) console.log(result);
    if(resultWithAuth) console.log(resultWithAuth);



  }
  catch(err){
    console.log(`\nERROR: ${err.message}\n`);
    process.exit();
  }
})();
