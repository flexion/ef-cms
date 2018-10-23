#!/usr/bin/env groovy

pipeline {

  agent any

  stages {
    stage('setup') {
      steps {
        script {
          def scmVars = checkout scm
          env.GIT_PREVIOUS_SUCCESSFUL_COMMIT = scmVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT
          env.GIT_COMMIT = scmVars.GIT_COMMIT
        }
      }
    }
    // stage('components') {
    //   parallel {
    //     stage('web-client') {
    //       when {
    //         expression {
    //           return checkCommit('web-client')
    //         }
    //       }
    //       steps {
    //         build job: 'ef-cms-ui', parameters: [
    //           [$class: 'StringParameterValue', name: 'sha1', value: "${GIT_COMMIT}"],
    //           [$class: 'StringParameterValue', name: 'target_sha1', value: "${env.CHANGE_TARGET}"],
    //           [$class: 'StringParameterValue', name: 'branch_name', value: "${env.BRANCH_NAME}"]
    //         ]
    //       }
    //     }
    //     stage('serverless-api') {
    //       when {
    //         expression {
    //           return checkCommit('serverless-api')
    //         }
    //       }
    //       steps {
    //         build job: 'ef-cms-api', parameters: [
    //           [$class: 'StringParameterValue', name: 'sha1', value: "${GIT_COMMIT}"],
    //           [$class: 'StringParameterValue', name: 'target_sha1', value: "${env.CHANGE_TARGET}"],
    //           [$class: 'StringParameterValue', name: 'branch_name', value: "${env.BRANCH_NAME}"]
    //         ]
    //       }
    //     }
    //   }
    // }
    stage('pa11y') {
      steps {
        script {
          def runner = docker.build 'pa11y', '-f Dockerfile.pa11y .'
          runner.inside('-v /home/tomcat:/home/tomcat') {
            dir('serverless-api') {
              sh 'npm i'
              sh 'npm run start:local'
            }
            dir('web-client') {
              sh 'npm i'
              sh 'npm run dev'
              sh 'npm run test:pa11y'
            }
          }
        }
      }
    }
    stage('cypress') {
      steps {
        script {
          def runner = docker.build 'cypress', '-f Dockerfile.cypress .'
          runner.inside('-v /home/tomcat:/home/tomcat') {
            dir('serverless-api') {
              sh 'npm i'
              sh 'npm run start:local'
            }
            dir('web-client') {
              sh 'npm i'
              sh 'npm run dev'
              sh 'npm run test:cypress'
            }
          }
        }
      }
    }
  }
  post {
    always {
      deleteDir()
    }
  }
}

def checkCommit(folder) {
  if (env.CHANGE_TARGET) {
    def matches = sh(returnStatus:true, script: "git diff --name-only origin/${env.CHANGE_TARGET} | grep '^${folder}'")
    return !matches
  } else if (env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'master') {
    return true
  }
}