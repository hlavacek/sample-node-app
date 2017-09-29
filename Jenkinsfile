node {
    docker.image('vhlavacek/docker-on-ubuntu').inside("-u root") {
        stage('Checkout scm') {
            checkout scm
        }
        stage('Build docker image') {
            sh '''docker build . -t node-sample-app'''
        }
        stage('Push image to registry') {
            withCredentials([string(credentialsId: 'REGISTRY_URL', variable: 'REGISTRY_URL')]) {
                 {
                    sh '''
                        docker tag node-sample-app:latest $REGISTRY_URL/node-sample-app:latest
                        docker push $REGISTRY_URL/node-sample-app:latest'''
                }
            }
        }
        stage('Deploy to swarm') {
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
    }
}
