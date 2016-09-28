#NOT FINAL

## basic-node-auth

This is a 100% basic boilerplate to get an authentication server running quick.

**Feautures**

* json webtoken authentication
* proper password hashing using bcrypt
* E-Mail Confirmation (basic mail template thanks to [beefree.io](https://beefree.io))
* **C**reate, **R**ead, **U**pdate and **D**elete users
* proper userUUID's using uuid

## Code Example

Show what the library does as concisely as possible, developers should be able to figure out **how** your project solves their problem by looking at the code example. Make sure the API you are showing off is obvious, and that your code is short and concise.

## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## Installation

Provide code examples and explanations of how to get the project.

## API Reference

### test api
####`/api/` (GET)
use this command to test if the server is up and running properly

---

### register user
####`/api/register` (POST)
register a user

requires:
* `username`
* `email`
* `password

---

### login
####`/api/login` (POST)
login a user

requires:
* `username` **OR** `email`
* password`

---

### update user info
####`/api/user` (PUT)
update user data **NOT** password, to update password see `/api/user/password`

requires:
* token send as (choose one):
  * `x-access-token` in header
  * `Authorization` in header
  * `token` in body
* whatever info you want to change

---

### update user password
####`/api/user` (PUT)

requires:
* token send as (choose one):
  * `x-access-token` in header
  * `Authorization` in header
  * `token` in body
* `oldPassword` the old password
* `newPassword` the new password

---

### delete user
####`/api/user` (DELETE)

requires:
* token send as (choose one):
  * `x-access-token` in header
  * `Authorization` in header
  * `token` in body
* `password` user password


## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)
