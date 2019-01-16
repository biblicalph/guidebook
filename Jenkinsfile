#!/usr/bin/env groovy

node {
  dir('coop') {
    checkout scm
    def run_test = sh (script: "git log -1 | grep '\\[skip test\\]'", returnStatus: true)
  }

  if (run_test) {
    docker.image('node:8-alpine').inside("-e HOME=${pwd()} -e NODE_ENV=development") {
      stage('Test:coop') {
        dir('coop') {
          try {
            sh 'npm --version'
            sh 'printenv'
            sh 'NODE_ENV=development npm install'
            sh 'pwd'
            sh 'ls -a'
          } catch (err) {
            echo 'Error building guidebook'
            throw err
          }
        }
      }
      stage('Test:cypress') {
        dir('cypress') {
          git branch: 'master', url: 'https://github.com/biblicalph/books'

          try {
            sh 'NODE_ENV=development npm install'
            sh 'ls -a'
            sh 'npm test'
          } catch (err) {
            echo 'Error build books'
            throw err
          }
        }
      }
    }
  } else {
    echo 'Skipping tests...'
  }
}