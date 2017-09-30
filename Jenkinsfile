node {
    def customImage = null

    stage('Checkout scm') {
        checkout scm
    }
    stage('Build docker image') {
        customImage = docker.build("node-sample-app")
    }
    stage('Push image to registry') {
        withCredentials([string(credentialsId: 'REGISTRY_URL', variable: 'REGISTRY_URL')]) {
            docker.withRegistry('https://$REGISTRY_URL') {
                customImage.push()
            }
        }
    }
    stage('start application') {
        withCredentials([string(credentialsId: 'REGISTRY_URL', variable: 'REGISTRY_URL')]) {
            sh '''
                docker stop node-sample-app || true
                docker rm node-sample-app || true
                docker run -p 81:8080 -d
                    --name node-sample-app \
                    $REGISTRY_URL/node-sample-app:latest
                '''
        }
    }
}
