#!/usr/bin/env groovy

def booksDir = 'bookRepo'

node {
  stage('Checkout') {
    checkout scm

    dir(booksDir) {
      git branch: 'master', url: 'https://github.com/biblicalph/books'
      sh 'pwd'
      sh 'touch .babelrc'
      sh 'echo "{}" >> .babelrc'
      sh 'ls'
      sh 'cat .babelrc'
    }
  }

  def run_test = sh (script: "git log -1 | grep '\\[skip test\\]'", returnStatus: true)

  if (run_test) {
    docker.image('node:8-alpine').inside('-e NODE_ENV=development') {
      stage('Test:guidebook') {
        try {
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
            sh 'pwd'
            sh 'ls'
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
}