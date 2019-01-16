#!/usr/bin/env groovy

node {
  checkout scm
  
  def echoVal = sh(script: 'echo "clang"', returnStdout: true)
  def exitStatus = sh(script: 'exit 1', returnStatus: true)

  withEnv(["ECHO_VAL=${echoVal},EXIT_STATUS=${exitStatus}"]) {
    docker.image('node:8-alpine').inside {
      stage('Test') {
        try {
          sh 'npm --version'
          sh 'printenv'
          sh 'npm test -- __tests__/sample.spec.js'
        } catch (err) {
          throw error
        }
      }
    }
  }
}