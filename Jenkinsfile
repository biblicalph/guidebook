node {
  docker.image('node:10').inside('-p 3000:3000') {
    sh 'npm --version'
    sh 'npm ci'
  }
}