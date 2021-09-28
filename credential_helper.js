const Powershell = require('node-powershell');

function getDate () {
  var date = new Date();
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

async function getCredential(target){
  const ps = new Powershell({noProfile: true, verbose: false});

  await ps.addCommand(`Get-StoredCredential -Target '${target}' -AsCredentialObject | ConvertTo-Json -Compress`);
  var storedCreds = await ps.invoke();
  await ps.dispose();

  if(storedCreds) return JSON.parse(storedCreds);
  else return null;
}

async function removeCredential(target) {
  const ps = new Powershell({noProfile: true, verbose: false});

  await ps.addCommand(`Remove-StoredCredential -Target '${target}' -ErrorAction SilentlyContinue -Verbose`);
  var result = await ps.invoke();
  await ps.dispose();

  if(result) return result;
  else return null;
  
}

async function newCredential(target, username, password) {
  const ps = new Powershell({noProfile: true, verbose: false});

  await ps.addCommand(`New-StoredCredential -Target '${target}' -UserName '${username}' -Password '${password}' -Persist LocalMachine -Comment 'Created by Git Credential Manager on ${getDate()}' | ConvertTo-Json -Compress`);
  var result = await ps.invoke();
  await ps.dispose();

  if(result) return result;
  else return null;
}

async function changeCommitName(username, email){
  const ps = new Powershell({noProfile: true, verbose: false});

  try{
    await ps.addCommand(`git config --global user.name ${username}`);
    await ps.addCommand(`git config --global user.email ${email}`);

    await ps.invoke();
    await ps.dispose();

    return true;
  }
  catch(err){
    return false;
  }
}

module.exports = {getCredential, removeCredential, newCredential, changeCommitName}