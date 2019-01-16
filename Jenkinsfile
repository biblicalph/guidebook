#!/usr/bin/env groovy

node {
  checkout scm

  def echoVal = sh(script: 'echo "clang"', returnStdout: true)
  def exitStatus = sh(script: 'exit 1', returnStatus: true)

  withEnv(["ECHO_VAL=${echoVal}","EXIT_STATUS=${exitStatus}"]) {
    docker.image('node:8-alpine').inside {
      stage('Test') {
        try {
          sh 'npm --version'
          sh 'printenv'
          sh 'NODE_ENV=development npm install'
        } catch (err) {
          echo 'Error building guidebook'
          throw err
        }
      }
      stage('Test:other') {
        git branch: 'master', url: 'https://github.com/biblicalph/books'

        try {
          sh 'NODE_ENV=development npm install'
          sh 'npm test'
        } catch (err) {
          echo 'Error building books'
          throw err
        }
      }
    }
  }
}