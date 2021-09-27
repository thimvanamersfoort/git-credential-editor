const Powershell = require('node-powershell');

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

async function newCredential(target, ) {
  const ps = new Powershell({noProfile: true, verbose: false});

}

module.exports = {getCredential, removeCredential, newCredential}