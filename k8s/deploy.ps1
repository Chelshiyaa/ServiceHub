# ServiceHub EKS Deployment Script for PowerShell
# Usage: .\deploy.ps1 [namespace]

param(
    [string]$Namespace = "servicehub"
)

Write-Host "🚀 Deploying ServiceHub to EKS..." -ForegroundColor Green
Write-Host "Namespace: $Namespace" -ForegroundColor Cyan

# Check if kubectl is configured
try {
    kubectl cluster-info | Out-Null
} catch {
    Write-Host "❌ Error: kubectl is not configured or cluster is not accessible" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Step 1: Creating namespace..." -ForegroundColor Yellow
kubectl apply -f namespace.yaml

Write-Host ""
Write-Host "📝 Step 2: Creating ConfigMap..." -ForegroundColor Yellow
kubectl apply -f configmap.yaml

Write-Host ""
Write-Host "🔐 Step 3: Creating Secrets..." -ForegroundColor Yellow
if (-not (Test-Path "secret.yaml")) {
    Write-Host "⚠️  Warning: secret.yaml not found. Creating from template..." -ForegroundColor Yellow
    Write-Host "Please update secret.yaml with your actual values before deploying!" -ForegroundColor Yellow
}
kubectl apply -f secret.yaml

Write-Host ""
Write-Host "🗄️  Step 4: Deploying MongoDB..." -ForegroundColor Yellow
kubectl apply -f mongodb-deployment.yaml

Write-Host ""
Write-Host "⏳ Waiting for MongoDB to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n $Namespace 2>$null

Write-Host ""
Write-Host "🖥️  Step 5: Deploying Server..." -ForegroundColor Yellow
kubectl apply -f server-deployment.yaml

Write-Host ""
Write-Host "🌐 Step 6: Deploying Client..." -ForegroundColor Yellow
kubectl apply -f client-deployment.yaml

Write-Host ""
Write-Host "🔌 Step 7: Deploying Ingress..." -ForegroundColor Yellow
kubectl apply -f ingress.yaml

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Checking deployment status..." -ForegroundColor Cyan
kubectl get all -n $Namespace

Write-Host ""
Write-Host "🔍 Getting Ingress URL (may take a few minutes for ALB to be created)..." -ForegroundColor Cyan
kubectl get ingress servicehub-ingress -n $Namespace

Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs: kubectl logs -f deployment/servicehub-server -n $Namespace"
Write-Host "  Check pods: kubectl get pods -n $Namespace"
Write-Host "  Check services: kubectl get svc -n $Namespace"
Write-Host "  Delete all: kubectl delete namespace $Namespace"

