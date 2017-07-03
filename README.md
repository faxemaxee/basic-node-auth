# NOT FINAL

## basic-node-auth

This is a 100% basic boilerplate to get an authentication server running.

**Feautures**

* json webtoken authentication
* proper password hashing using bcrypt
* E-Mail Confirmation (basic mail template thanks to [beefree.io](https://beefree.io))
* **C**reate, **R**ead, **U**pdate and **D**elete users
* proper userUUID's using uuid

## setup
##### clone 
```
git clone https://github.com/faxemaxe/basic-node-auth.git
```
##### install
```
npm install
```
##### configure in config.js
```
var config = {
  //secret which is used to hash json-web-token
  'secret': 'supersecret-json-web',

  //mongoDB Connection
  'database': 'mongodb://localhost/basic-node-auth',

  'mailConfig': {

    //SMTP Host
    host: 'host.de',

    //SSL Port
    port: 465,

    //use SSL (recommended)
    secure: true,

    //mail credentials
    auth: {
      user: 'john@doe.de',
      pass: 'supersecure'
    }
  }
};
module.exports = config;
```
##### run
```
node server
```
##### tip
I prefer using `nodemon` as a wrapper for standard node server, it watches your files and restarts the server automatically. It is included as a devDependency in the package.json but may require a global installation.

## why is this here?

Too often I just needed a small user-crud, maybe featuring a token-based authentication to get a project up and running or just use it as  base for something else. There you go, just clone, install, config and run...



## API Reference

### test api
#### `/api/` (GET)
use this command to test if the server is up and running properly

---

### register user
#### `/api/register` (POST)
register a user

requires:
* `username`
* `email`
* `password`

---

### login
#### `/api/login` (POST)
login a user

requires:
* `username` **OR** `email`
* `password`

---

### update user info
#### `/api/user` (PUT)
update user data **NOT** password, to update password see `/api/user/password`

requires:
* token send as (choose one):
  * `x-access-token` in header
  * `Authorization` in header
  * `token` in body
* whatever info you want to change

---

### update user password
#### `/api/user/password` (PUT)

requires:
* token send as (choose one):
  * `x-access-token` in header
  * `Authorization` in header
  * `token` in body
* `oldPassword` the old password
* `newPassword` the new password

---

### delete user
#### `/api/user` (DELETE)

requires:
* token send as (choose one):
  * `x-access-token` in header
  * `Authorization` in header
  * `token` in body
* `password` user password

---

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)
