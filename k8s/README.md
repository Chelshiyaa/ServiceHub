# Kubernetes Deployment Guide for AWS EKS

This guide will help you deploy ServiceHub to AWS EKS (Elastic Kubernetes Service).

## Prerequisites

1. **AWS CLI** installed and configured
2. **kubectl** installed
3. **eksctl** or AWS Console access to create EKS cluster
4. **AWS Load Balancer Controller** installed in your cluster
5. Docker images pushed to Docker Hub (already done: `chelshiya01/servicehub-server:latest` and `chelshiya01/servicehub-client:latest`)

## Step 1: Create EKS Cluster

### Option A: Using eksctl (Recommended)

```bash
eksctl create cluster \
  --name servicehub-cluster \
  --region us-east-1 \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3
```

### Option B: Using AWS Console

1. Go to EKS Console → Create Cluster
2. Configure cluster settings
3. Create node group

## Step 2: Configure kubectl

```bash
aws eks update-kubeconfig --name servicehub-cluster --region us-east-1
kubectl get nodes
```

## Step 3: Install AWS Load Balancer Controller

```bash
# Add EKS Helm chart repo
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# Install AWS Load Balancer Controller
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=servicehub-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Verify installation
kubectl get deployment -n kube-system aws-load-balancer-controller
```

## Step 4: Update Secrets

Edit `k8s/secret.yaml` with your actual values:

```bash
# Edit the secret file
nano k8s/secret.yaml

# Or use kubectl to create secret directly:
kubectl create secret generic servicehub-secrets \
  --from-literal=JWT_SECRET='your_actual_jwt_secret' \
  --from-literal=CLOUDINARY_CLOUD_NAME='your_cloudinary_name' \
  --from-literal=CLOUDINARY_API_KEY='your_api_key' \
  --from-literal=CLOUDINARY_API_SECRET='your_api_secret' \
  --namespace=servicehub \
  --dry-run=client -o yaml | kubectl apply -f -
```

## Step 5: Deploy to EKS

Deploy all resources in order:

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create ConfigMap
kubectl apply -f k8s/configmap.yaml

# 3. Create Secrets (update values first!)
kubectl apply -f k8s/secret.yaml

# 4. Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# 5. Deploy Server
kubectl apply -f k8s/server-deployment.yaml

# 6. Deploy Client
kubectl apply -f k8s/client-deployment.yaml

# 7. Deploy Ingress
kubectl apply -f k8s/ingress.yaml
```

Or deploy everything at once:

```bash
kubectl apply -f k8s/
```

## Step 6: Verify Deployment

```bash
# Check all resources
kubectl get all -n servicehub

# Check pods status
kubectl get pods -n servicehub

# Check services
kubectl get svc -n servicehub

# Check ingress (wait for ALB to be created)
kubectl get ingress -n servicehub

# View logs
kubectl logs -f deployment/servicehub-server -n servicehub
kubectl logs -f deployment/servicehub-client -n servicehub
kubectl logs -f deployment/mongodb -n servicehub
```

## Step 7: Get Application URL

```bash
# Get the ALB URL from Ingress
kubectl get ingress servicehub-ingress -n servicehub

# The ADDRESS field will show your ALB URL
# Example: k8s-servicehub-servicehub-xxxxx.us-east-1.elb.amazonaws.com
```

Access your application at: `http://<ALB-URL>`

## Step 8: Configure HTTPS (Optional but Recommended)

1. **Request SSL Certificate in ACM**:
   - Go to AWS Certificate Manager
   - Request a public certificate for your domain
   - Validate the certificate

2. **Update Ingress**:
   - Edit `k8s/ingress.yaml`
   - Uncomment and update the certificate ARN:
     ```yaml
     alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:region:account-id:certificate/cert-id
     alb.ingress.kubernetes.io/ssl-redirect: '443'
     ```
   - Apply changes:
     ```bash
     kubectl apply -f k8s/ingress.yaml
     ```

## Production Considerations

### 1. Use Persistent Volume for MongoDB

For production, replace `emptyDir` with a PersistentVolumeClaim:

```yaml
# Create mongodb-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
  namespace: servicehub
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: gp3
  resources:
    requests:
      storage: 20Gi
```

Then update `mongodb-deployment.yaml` to use:
```yaml
persistentVolumeClaim:
  claimName: mongodb-pvc
```

### 2. Use AWS RDS for MongoDB (Recommended for Production)

Instead of running MongoDB in Kubernetes, use AWS DocumentDB or MongoDB Atlas:

1. Create DocumentDB cluster in AWS
2. Update `configmap.yaml`:
   ```yaml
   MONGODB_URI: "mongodb://username:password@docdb-endpoint:27017/servicehub?ssl=true&sslCAFile=rds-combined-ca-bundle.pem"
   ```

### 3. Horizontal Pod Autoscaling

```bash
kubectl autoscale deployment servicehub-server -n servicehub \
  --cpu-percent=70 \
  --min=2 \
  --max=10

kubectl autoscale deployment servicehub-client -n servicehub \
  --cpu-percent=70 \
  --min=2 \
  --max=10
```

### 4. Resource Monitoring

Install metrics server:
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n servicehub
kubectl logs <pod-name> -n servicehub
```

### Service not accessible
```bash
kubectl get endpoints -n servicehub
kubectl describe svc servicehub-server -n servicehub
```

### Ingress not creating ALB
```bash
kubectl describe ingress servicehub-ingress -n servicehub
kubectl logs -n kube-system deployment/aws-load-balancer-controller
```

### MongoDB connection issues
```bash
# Test MongoDB connection from server pod
kubectl exec -it deployment/servicehub-server -n servicehub -- sh
# Inside pod:
# nslookup mongodb
# telnet mongodb 27017
```

## Clean Up

To delete everything:

```bash
kubectl delete namespace servicehub
```

To delete the EKS cluster:

```bash
eksctl delete cluster --name servicehub-cluster --region us-east-1
```

## Useful Commands

```bash
# Scale deployments
kubectl scale deployment servicehub-server --replicas=3 -n servicehub

# Update image
kubectl set image deployment/servicehub-server server=chelshiya01/servicehub-server:new-tag -n servicehub

# Rollback deployment
kubectl rollout undo deployment/servicehub-server -n servicehub

# View deployment history
kubectl rollout history deployment/servicehub-server -n servicehub
```

