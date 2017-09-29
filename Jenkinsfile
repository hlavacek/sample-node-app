node {
    def customImage = null

    stage('Checkout scm') {
        checkout scm
    }
    stage('Build docker image') {
        customImage = docker.build("node-sample-app")
    }
    stage('Push image to registry') {
        docker.withRegistry('https://$REGISTRY_URL') {
            customImage.push()
        }
    }
    stage('deploy to swarm') {
        withCredentials([string(credentialsId: 'REGISTRY_URL', variable: 'REGISTRY_URL')]) {
            sh '''
                docker service rm node-sample-app || true
                docker service create -p 80:8080 --with-registry-auth \
                    --detach=false \
                    --name node-sample-app \
                    $REGISTRY_URL/node-sample-app:latest
                '''
        }
    }
}
