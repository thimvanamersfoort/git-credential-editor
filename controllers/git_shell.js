const shell = require('shelljs');

class gitShell{

  async getRemoteName(){
    var output = await shell.exec('git remote', {silent: true, async: true})

    if(output['stderr']) return output['stderr'];
    if(output['stdout']) return output['stdout'].replace('\n', '');

    return null;
  }

  async getRemoteUrl(remoteName){
    var output = await shell.exec(`git config --get remote.${remoteName}.url`, {silent: true, async: true});
    return await output['stdout'].replace('\n', '');
  }

}

module.exports = gitShell; 