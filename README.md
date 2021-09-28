# Git Credential Editor: A Github credential store for Windows

### Why this application?
I was enjoying my Github / VS-Code developing experience, until I noticed a small annoyance. To change credentials which Git uses to authenticate to your Git(hub) Remote Repository, you need to alter the credential store which Git uses.

I wanted to do this, because I was interested in working with multiple accounts, on multiple repositories, with multiple devices. And this process could be automated very quickly, by using a simple Git credential store like a text-file, but that would be a big vulnerability risk. So I decided to make use of Windows own Credential Manager, which can be used with Git and controlled with Powershell.

### How does the program work?
The program takes several steps to make sure your credentials are all set the way you desire:

1. You first define your login credentials in the `access.json` file as such: 
```json
[
  {"username": "GITHUB USERNAME", "email": "EMAIL FOR COMMIT INFO", "password": "GITHUB ACCESS TOKEN"}, 
  {"username": "GITHUB USERNAME", "email": "EMAIL FOR COMMIT INFO", "password": "GITHUB ACCESS TOKEN"}
]
```
Because you'll want to switch between accounts, you can define multiple user objects here. These can also be retrieved from a database, for security, but that is not implemented yet.

The application will look into this file and use the provided data to make changes to Windows Credential Manager. *The Github Personal Access Token will be sent as a password*.

2. By using [Prompts](https://github.com/terkelg/prompts), the user will be prompted to select the current user that is saved in the Windows Credential Manager, for the active repository (or none, if not applicable), and the user the want to change to. 

3. The application then goes to work by doing the following steps:
  3.1 Looks for currently selected user, and deletes if found.
  3.2 Creates new Credentials with the user-defined input
  3.3 Also changes the following Git-Config values globally: `user.name` and `user.email`

  This is all done by executing Powershell commands in the `credential_helper.js` file, making use of the [Node-Powershell](https://github.com/rannn505/node-powershell) library.

Errors will be thrown and logged. The application is meant to be used as a global NPM CLI package, making it callable from the `PATH`, and usable all over your system.

### Use for yourself
#### Requirements:
- Make sure Powershell is allowed to run unfamiliar code (disabled by default): 
```powershell 
Set-ExecutionPolicy Bypass -Scope CurrentUser
```
- Have NPM, NodeJS and Git installed (duhhh)
- **Important:** Make sure you have the [Powershell Credential Manager](https://github.com/davotronic5000/Powershell_Credential_Manager) package installed, to access the Windows Credential Manager from PS.
- **Important:** Make sure you execute this command in a folder where a Git repository already is initialized, and a Git Remote is set by using `git remote add <name> <url>`

#### Installation:
1. Clone this Git repository to your local system.
2. `npm install` to install dependencies.
3. Remove default credentials and add your own credentials in `access.json`
4. `npm pack` to pack the library into a G-Zipped Tarball.
5. `npm install -g ./name_of_your_tarball.tgz` to install the library globally in your path.

#### Usage:
Type `git-credential-editor` in Powershell / CMD (Linux distros not currently supported), and execute in the folder where you want to use it.

### General info:
- Git credentials are stored per repository (in Wincred Manager), and are stored in 2 separate Credentials, with the following syntax:
```
Credential 1 (No auth):

  Target: git:https://github.com/<USERNAME>/<REPO_NAME>
  Username: Your Github Username
  Password: Your Github Personal Access Token

Credential 2 (With auth):

  Target: git:https://<USERNAME>@github.com/<USERNAME>/<REPO_NAME>
  Username: Your Github Username
  Password: Your Github Personal Access Token
```
One of these credentials could be unnessecary, but with my personal experience, Git will try to reference them both, so for safe practices, they also get generated both.

### To-Do:
- [ ] Add support for Linux
- [ ] Safe storage for credentials (database implementation)
- [ ] More complex CLI, which accepts parameters and has more configuration options.

### Contributing:

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

