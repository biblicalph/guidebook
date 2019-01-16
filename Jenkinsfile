#!/usr/bin/env groovy

node {
  def echoVal = sh(script: 'echo "clang"', returnStdout: true)
  def exitStatus = sh(script: 'exit 1', returnStatus: true)

  withEnv(["ECHO_VAL=${echoVal}","EXIT_STATUS=${exitStatus}"]) {
    docker.image('node:8-alpine').inside {
      parallel(
        stage('Test:coop') {
          dir('coop') {
            checkout scm

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
              echo 'Error building books'
              throw err
            }
          }
        }
      )
    }
  }
}