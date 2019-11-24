# jwt-auth-boilerplate


A Node.Js boilerplate built using Express.Js framework to provide a skeleton of User Authentication using JSON Web Token (JWT) library.


## Getting Started

The easiest way to get started is to clone the repository:

```sh
# Get the latest snapshot
git clone https://github.com/jimcute/jwt-auth-boilerplate.git

# Change directory
cd jwt-auth-boilerplate

# Install NPM dependencies
npm install

# Then simply start your app
node app.js
```

## Features

- **Local Authentication** using Email and Password
- MVC Project Structure
- JWT Authentication


### Register API

**Type:** POST <br>
**Parameters:** email, password, firstname, lastname

```sh
# Call the API using Postman with the required parameters
http://localhost:3000/api/auth/register
```

<img src="https://content.screencast.com/users/enginesoft/folders/Jing/media/b69294d4-ff25-41bb-b0c3-b30a969ddd61/00000231.png" />


### Login API

**Type:** POST <br>
**Parameters:** email, password

```sh
# Call the API using Postman with the required parameters
http://localhost:3000/api/auth/login
```

<img src="https://content.screencast.com/users/enginesoft/folders/Jing/media/0f95aa7b-e9ee-429c-9185-f29a45c30ce6/00000232.png" />


### Get Logged-In User Profile

**Type:** GET <br>
**Headers:** x-access-token

```sh
# Call the API using Postman with the required parameters
http://localhost:3000/api/v1/me
```

<img src="https://content.screencast.com/users/enginesoft/folders/Jing/media/2bbce9bc-b078-4bc2-a5d6-37cbda70a77c/00000233.png" />

