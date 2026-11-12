# Student Management System (Microservices, Docker, Kubernetes)

Author: Hoeum Chamnab | 2nd microservice: Delete Student

## Services
- api-gateway (8080) - single entry point (NodePort 30080)
- registration-service (8081) - POST /register (same pod as gateway)
- delete-service (8082) - DELETE /students/:id (own pod)
- mysql (3306) - database `college`, table `students`

## Run
```bash
minikube start
eval $(minikube docker-env)   # PowerShell: & minikube -p minikube docker-env --shell powershell | Invoke-Expression
docker build -t api-gateway:1.0 ./api-gateway
docker build -t registration-service:1.0 ./registration-service
docker build -t delete-service:1.0 ./delete-service

kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/pod1-deployment.yaml
kubectl apply -f k8s/pod2-deployment.yaml
kubectl get pods
minikube service api-gateway --url
```

## Test (Postman)
- POST   `<url>/api/register`  body: student_name, student_mobile, student_email, student_password
- DELETE `<url>/api/students/1`

## Check database
```bash
kubectl exec -it deploy/mysql -- mysql -uroot -prootpass college -e "SELECT * FROM students;"
```
