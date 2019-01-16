#!/usr/bin/env groovy

def booksDir = 'coop'
def guidesDir = 'books'
def bothDirs = [booksDir, guidesDir]

def cleanUpTestDirectories(directories) {
  echo 'Cleaning directories...'
  for (i = 0; i < directories.size(); ++i) {
    sh "rm -rf ${directories[i]}"
  }
}

def setUpTestDirectories(directories) {
  echo 'setting up directories...'
  for (i = 0; i < directories.size(); ++i) {
    sh "mkdir ${directories[i]}"
  }
}

node {
  stage('Checkout') {
    checkout scm

    dir(booksDir) {
      git branch: 'master', url: 'https://github.com/biblicalph/books'
    }
  }

  def run_test = sh (script: "git log -1 | grep '\\[skip test\\]'", returnStatus: true)

  if (run_test) {
    docker.image('node:8-alpine').inside('-e NODE_ENV=development') {
      stage('Test:guidebook') {
        try {
          sh 'pwd'
          sh 'ls'
          sh 'npm install'
          sh 'npm test -- __tests__/sample.spec.js'
        } catch (err) {
          echo 'Error building guidebook'
          throw err
        }
      }
      stage('Test:cypress') {
        dir(booksDir) {
          try {
            sh 'pwd'
            sh 'ls'
            sh 'npm install'
            sh 'npm test'
          } catch (err) {
            echo 'Error build books'
            throw err
          }
        }
      }
    }
  } else {
    echo 'Skipped tests...'
  }
  // cleanUpTestDirectories(coop_cypress_dirs)
  // setUpTestDirectories(coop_cypress_dirs)
  // sh "cd ${coop_dir}"
  // checkout scm
  // def run_test = sh (script: "git log -1 | grep '\\[skip test\\]'", returnStatus: true)

  // if (run_test) {
  //   docker.image('node:8-alpine').inside {
  //     stage('Test:coop') {
  //       try {
  //         sh 'npm --version'
  //         // sh 'printenv'
  //         sh 'NODE_ENV=development npm install'
  //         sh 'pwd'
  //         sh 'ls -a'
  //         sh 'npm test -- __tests__/sample.spec.js'
  //       } catch (err) {
  //         echo 'Error building guidebook'
  //         throw err
  //       }
  //     }
  //     stage('Test:cypress') {
  //       sh "cd ${cypress_dir}"
  //       git branch: 'master', url: 'https://github.com/biblicalph/books'

  //       try {
  //         sh 'npm install'
  //         sh 'pwd'
  //         sh 'ls -a node_modules | grep "babel"'
  //         sh 'ls -a node_modules/@babel'
  //         sh 'NODE_ENV=development npm test'
  //       } catch (err) {
  //         echo 'Error build books'
  //         throw err
  //       }
  //     }
  //   }
  // } else {
  //   echo 'Skipping tests...'
  // }
}