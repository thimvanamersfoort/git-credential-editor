const shell = require('shelljs');

class gitShell{

  getRemoteName(){
    var output = shell.exec('git remote', {silent: true})

    if(output['stderr']) return output['stderr'];
    if(output['stdout']) return output['stdout'].replace('\n', '');

    return null;
  }

  getRemoteUrl(remoteName){
    var output = shell.exec(`git config --get remote.${remoteName}.url`, {silent: true});
    return output['stdout'].replace('\n', '');
  }

}

module.exports = gitShell; 