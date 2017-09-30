node {
    def customImage = null

    stage('Checkout scm') {
        checkout scm
    }
    stage('Build docker image') {
        customImage = docker.build("node-sample-app")
    }
    stage('start application') {
        sh '''
            docker stop node-sample-app || true
            docker rm node-sample-app || true
            docker run -p 81:8080 -d
                --name node-sample-app \
                node-sample-app:latest
            '''
        }
    }
}
