#!/usr/bin/env groovy

node {
  def echoVal = sh(script: 'echo "clang"', returnStdout: true)
  def exitStatus = sh(script: 'exit 1', returnStatus: true)

  withEnv(["ECHO_VAL=${echoVal}","EXIT_STATUS=${exitStatus}"]) {
    stage('Test') {
      checkout scm

      docker.image('node:8-alpine').inside {
        try {
          sh 'npm --version'
          sh 'printenv'
          sh 'NODE_ENV=development npm install'
        } catch (err) {
          echo 'Error building guidebook'
          throw error
        }
      }
    }
    
    stage('Test:other') {
      git branch: 'master', url: 'https://github.com/books'

      docker.image('node:8-alpine').inside {
        try {
          sh 'NODE_ENV=development npm install'
          sh 'npm test'
        } catch (err) {
          echo 'Error building books'
          throw 
        }
      }
    }
  }
}