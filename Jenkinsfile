node {
    docker.image('vhlavacek/docker-on-ubuntu').inside("-u root") {
        stage('Install aws cli') {
            sh '''
                apt-get update
                apt-get install python2.7 python-pip -y 
                pip install --upgrade awscli
                aws --version
                '''
        }
        stage('Checkout scm') {
            Checkout scm
        }
        stage('Build docker image') {
            sh '''docker build . -t node-sample-ap'''
        }
        stage('Push image to registry') {
            withCredentials([string(credentialsId: 'REGISTRY_URL', variable: 'REGISTRY_URL')]) {
                withAWS(credentials:'aws-access-key') {
                    sh '''
                        set +x
                        eval $(aws ecr get-login --no-include-email --region eu-west-1)
                        set -x
                        docker tag node-sample-ap:latest $REGISTRY_URL/node-sample-ap:latest
                        docker push $REGISTRY_URL/node-sample-ap:latest'''
                }
            }
        }
        stage('Deploy to swarm') {
            withCredentials([file(credentialsId: 'docker-swarm-key', variable: 'DOCKER_SWARM_KEY'),
                    string(credentialsId: 'SWARM_CONNECTION_STRING', variable: 'SWARM_CONNECTION_STRING'),
                    string(credentialsId: 'REGISTRY_URL', variable: 'REGISTRY_URL')]) {
                withAWS(credentials:'aws-access-key') {
                    sh '''ssh -i $DOCKER_SWARM_KEY \
                        -o StrictHostKeyChecking=no \
                        -NL localhost:2374:/var/run/docker.sock \
                        $SWARM_CONNECTION_STRING &
                        sleep 5
                        export DOCKER_HOST=localhost:2374
                        set +x
                        eval $(aws ecr get-login --no-include-email --region eu-west-1)
                        set -x
                        docker service rm node-sample-app || true
                        docker service create -p 80:8080 --with-registry-auth \
                            --detach=false \
                            --name node-sample-app \
                            $REGISTRY_URL/node-sample-ap:latest
                        '''
                }
            }
        }
    }
}
