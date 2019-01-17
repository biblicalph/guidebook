#!/usr/bin/env groovy

def booksDir = 'bookRepo'
def guidesDir = 'guidebookRepo'
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
    cleanUpTestDirectories(bothDirs)

    dir(guidesDir) {
      checkout scm
      sh 'pwd'
      sh 'ls'
    }

    dir(booksDir) {
      git branch: 'master', url: 'https://github.com/biblicalph/books'
      sh 'pwd'
      sh 'ls'
    }
  }

  sh "cd ${guidesDir}"
  def run_test = sh (script: "git log -1 | grep '\\[skip test\\]'", returnStatus: true)

  if (run_test) {
    docker.image('node:8-alpine').inside('-e NODE_ENV=development') {
      stage('Test:guidebook') {
        dir(guidesDir) {
          try {
            sh 'npm install'
            sh 'npm test -- __tests__/sample.spec.js'
          } catch (err) {
            echo 'Error building guidebook'
            throw err
          }
        }
      }
      stage('Test:cypress') {
        dir(booksDir) {
          try {
            sh 'pwd'
            sh 'ls'
            sh 'npm install'
            sh 'pwd'
            sh 'ls'
            sh './node_modules/.bin/jest'
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
}