#!/usr/bin/env groovy

node {
  def echoVal = sh(script: 'echo "clang"', returnStdout: true)
  def exitStatus = sh(script: 'exit 1', returnStatus: true)

  dir('coop') {
    checkout scm
    def run_test = sh (script: "git log -l | grep '\\[skip test\\]'", returnStatus)
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