#!/bin/bash

# ServiceHub EKS Deployment Script
# Usage: ./deploy.sh [namespace]

set -e

NAMESPACE=${1:-servicehub}

echo "🚀 Deploying ServiceHub to EKS..."
echo "Namespace: $NAMESPACE"

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Error: kubectl is not configured or cluster is not accessible"
    exit 1
fi

echo ""
echo "📦 Step 1: Creating namespace..."
kubectl apply -f namespace.yaml

echo ""
echo "📝 Step 2: Creating ConfigMap..."
kubectl apply -f configmap.yaml

echo ""
echo "🔐 Step 3: Creating Secrets..."
if [ ! -f secret.yaml ]; then
    echo "⚠️  Warning: secret.yaml not found. Creating from template..."
    echo "Please update secret.yaml with your actual values before deploying!"
fi
kubectl apply -f secret.yaml

echo ""
echo "🗄️  Step 4: Deploying MongoDB..."
kubectl apply -f mongodb-deployment.yaml

echo ""
echo "⏳ Waiting for MongoDB to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n $NAMESPACE || true

echo ""
echo "🖥️  Step 5: Deploying Server..."
kubectl apply -f server-deployment.yaml

echo ""
echo "🌐 Step 6: Deploying Client..."
kubectl apply -f client-deployment.yaml

echo ""
echo "🔌 Step 7: Deploying Ingress..."
kubectl apply -f ingress.yaml

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking deployment status..."
kubectl get all -n $NAMESPACE

echo ""
echo "🔍 Getting Ingress URL (may take a few minutes for ALB to be created)..."
kubectl get ingress servicehub-ingress -n $NAMESPACE

echo ""
echo "📋 Useful commands:"
echo "  View logs: kubectl logs -f deployment/servicehub-server -n $NAMESPACE"
echo "  Check pods: kubectl get pods -n $NAMESPACE"
echo "  Check services: kubectl get svc -n $NAMESPACE"
echo "  Delete all: kubectl delete namespace $NAMESPACE"

