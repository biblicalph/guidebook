#!/usr/bin/env groovy

def coop_dir = 'coop'
def cypress_dir = 'cypress'
def coop_cypress_dirs = [coop_dir, cypress_dir]

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
  def JENKINS_HOME=pwd()

  cleanUpTestDirectories(coop_cypress_dirs)
  setUpTestDirectories(coop_cypress_dirs)
  sh "cd ${coop_dir}"
  checkout scm
  def run_test = sh (script: "git log -1 | grep '\\[skip test\\]'", returnStatus: true)

  if (run_test) {
    docker.image('node:8-alpine').inside("-e HOME=${JENKINS_HOME} -e NODE_ENV=development") {
      stage('Test:coop') {
        dir(coop_dir) {
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
        dir(cypress_dir) {
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