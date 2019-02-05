![backend-devs](readme/backend-header.png)
# Backend

Starting implementation of best tools and techniques for all important features ( CRUD, swagger, auth, middlewares, HTTP2)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* git - [Installation guide](https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/).
* node.js - [Download page](https://nodejs.org/en/).
* yarn - [Download page](https://yarnpkg.com/lang/en/docs/install/#debian-stable).
* mongodb - [Download page](https://www.mongodb.com/download-center/community).


### Installing
// TO DO

First you need to clone repositorium

```
git clone https://github.com/linnovate/mean
```

Then you need to add certificates files to run https server [Instruction guide](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04).

```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
```
Then
```
sudo nano /etc/nginx/snippets/ssl-params.conf
```

And copy generated files to project

## Running the tests

Explain how to run the automated tests for this system.

Run in project root directory in terminal:
```
yarn start test
```

To generate view with test coverage run:
```
yarn start test:coverage
```


## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Node.js](https://nodejs.org/en/) - Node.js
* [Express](https://expressjs.com/) - Express
* [MongoDB](https://www.mongodb.com/) - MongoDB

## Authors
![backend-devs](readme/backend-devs.png)


* **Adam Gąsiorek** 
* **Arkadiusz Babiarz** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](readme/LICENSE.md) file for details

