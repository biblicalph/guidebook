# Guidebook

[![CircleCI](https://circleci.com/gh/biblicalph/guidebook.svg?style=svg)](https://circleci.com/gh/biblicalph/guidebook)
![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg "License: MIT")

Guidebook is a project that seeks to teach, through code, principles and best practices when writing NodeJS applications. 


## What the Project Covers
* Project structure
* Configuration management in different environments
* Testing - unit and integration tests
* Some functional programming in JS
* Repository pattern for database management
* Dockerising a NodeJS application
* Continuous integration (CI) setup

## What We'll be Building
In this project, we'll build an [API](https://en.wikipedia.org/wiki/Application_programming_interface) for a simple to-do application with the following features:

* A user can signup for a new account using an email and password
* A user can signup using a Google account
* A user can login to his/her account
* A logged in user can add a new to-do item
* A logged in user can edit an existing to-do item
* A logged in user can get the details of a to-do item
* A logged in user can get all his/her to-do items
* A logged in user can authorize the application to sync with his/her Google calendar. If the user has authorized use of Google calendar, the application will modify the user's calendar when a to-do item is created, edited or deleted. 

## Tools/Frameworks
* [NodeJS Express framework](https://expressjs.com/)
* [Mongodb](https://www.mongodb.com/) database using [Mongoose](https://mongoosejs.com/) ORM
* [Jest](https://jestjs.io/) for testing
* [Babel](https://babeljs.io/) for transpiling code. This allows us to you `import/export` in NodeJS
* [eslint](https://eslint.org/) for linting code using rules from [Airbnb style guide](https://github.com/airbnb/javascript)
* [prettier](https://prettier.io/) for formatting code
* [husky](https://github.com/typicode/husky) for managing git hooks

## Developing Locally
* Download and install [docker](https://www.docker.com/products/docker-desktop)
* Open a terminal, navigate to the project root and run `docker-compose up -d`. You don't need to install [Mongodb](https://www.mongodb.com/) on your machine as it is provided in the [docker](https://www.docker.com/) container
* From the project root, in the terminal, run `npm install` to install the project dependencies
* From the project root, in the terminal, run `npm run start:dev` to start the application server

