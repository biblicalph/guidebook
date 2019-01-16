#!/usr/bin/env groovy

def COOP_APP_DIR_NAME = 'coop'
def CYPRESS_APP_DIR_NAME = 'cypress'

def cleanUpTestDirectories() {
  sh "rm -rf ${COOP_APP_DIR_NAME} ${CYPRESS_APP_DIR_NAME}"
}

def setUpTestDirectories() {
  sh "mkdir ${COOP_APP_DIR_NAME} ${CYPRESS_APP_DIR_NAME}"
}

node {
  def JENKINS_HOME=pwd()

  cleanUpTestDirectories()
  setUpTestDirectories()
  sh "cd ${COOP_APP_DIR_NAME}"
  checkout scm
  def run_test = sh (script: "git log -1 | grep '\\[skip test\\]'", returnStatus: true)

  if (run_test) {
    docker.image('node:8-alpine').inside("-e HOME=${JENKINS_HOME} -e NODE_ENV=development") {
      stage('Test:coop') {
        dir(COOP_APP_DIR_NAME) {
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
        dir(CYPRESS_APP_DIR_NAME) {
          git branch: 'master', url: 'https://github.com/biblicalph/books'

          try {
            sh 'npm install'
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