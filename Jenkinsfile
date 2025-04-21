pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'projectfront'
        BACKEND_IMAGE = 'projectback'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/JuthathipBoo/project-front.git',
                    credentialsId: '308af05e-e425-4303-be5d-a72c81e7a921'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Lint') {
            parallel {
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            sh 'npm run lint || true'
                        }
                    }
                }
                stage('Backend Lint') {
                    steps {
                        dir('backend') {
                            sh 'npm run lint || true'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Frontend Test') {
                    steps {
                        dir('frontend') {
                            sh 'npm run test || true'
                        }
                    }
                }
                stage('Backend Test') {
                    steps {
                        dir('backend') {
                            sh 'npm run test || true'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Frontend Docker Build') {
                    steps {
                        dir('frontend') {
                            sh "docker build -t ${FRONTEND_IMAGE} ."
                        }
                    }
                }
                stage('Backend Docker Build') {
                    steps {
                        dir('backend') {
                            sh "docker build -t ${BACKEND_IMAGE} ."
                        }
                    }
                }
            }
        }

        stage('Deploy Containers') {
    steps {
        script {
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                sh """
                    docker stop ${FRONTEND_IMAGE} || true
                    docker rm ${FRONTEND_IMAGE} || true
                    docker stop ${BACKEND_IMAGE} || true
                    docker rm ${BACKEND_IMAGE} || true

                    docker run -d --name ${BACKEND_IMAGE} -p 5000:5000 ${BACKEND_IMAGE}
                    docker run -d --name ${FRONTEND_IMAGE} -p 3000:3000 --env BACKEND_URL=http://localhost:5000 ${FRONTEND_IMAGE}
                """
                sh "docker logs ${BACKEND_IMAGE} || true"
                sh "docker logs ${FRONTEND_IMAGE} || true"
            }
        }
    }
}

    }

    post {
        success {
            echo '✅ Deploy เสร็จสมบูรณ์บน localhost!'
        }
        failure {
            echo '❌ Pipeline มีปัญหา กรุณาตรวจสอบ log!'
        }
    }
}
