#!/usr/bin/env groovy

def coop_dir_name = 'coop'
def cypress_dir_name = 'cypress'

def cleanUpTestDirectories() {
  echo 'Cleaning directories...'
  sh "rm -rf ${coop_dir_name} ${coop_dir_name}"
}

def setUpTestDirectories() {
  echo 'setting up directories...'
  sh "mkdir ${coop_dir_name} ${coop_dir_name}"
}

node {
  def JENKINS_HOME=pwd()

  cleanUpTestDirectories()
  setUpTestDirectories()
  sh "cd ${coop_dir_name}"
  checkout scm
  def run_test = sh (script: "git log -1 | grep '\\[skip test\\]'", returnStatus: true)

  if (run_test) {
    docker.image('node:8-alpine').inside("-e HOME=${JENKINS_HOME} -e NODE_ENV=development") {
      stage('Test:coop') {
        dir(coop_dir_name) {
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
        dir(cypress_dir_name) {
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