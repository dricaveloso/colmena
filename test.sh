#!/bin/bash
export CI_BUILD_REF_NAME=k8deploy
export CI_REGISTRY_IMAGE=https://colmena.network:5000/maia/frontend

# export $KUBE_CERTIFICATE
export CI_COMMIT_REF_SLUG=k8deploy
export CI_ENVIRONMENT_SLUG=testk8 
export CI_PROJECT_PATH_SLUG=maia-frontend

export IMAGE_TAG=$CI_REGISTRY_IMAGE  #duvida
# echo "Image tag: " $IMAGE_TAG
export HOST_URL=${CI_COMMIT_REF_SLUG}.colmena.network
# echo "host_url: " $HOST_URL
export KUBE_NAMESPACE=frontend-7-testk8
# echo "namespace: " $KUBE_NAMESPACE

export CI_COMMIT_BRANCH=k8deploy

# app.gitlab.com/app: maia-frontend #__CI_PROJECT_PATH_SLUG__
# app.gitlab.com/env: testk8 # __CI_ENVIRONMENT_SLUG__
# --values ./vIngress.yaml \
# --set image.tag=$CI_COMMIT_BRANCH \
# --set image.repository=$CI_REGISTRY_IMAGE \

# --set certificate.name=$CI_COMMIT_REF_SLUG \
# --set certificate.issuer_name=letsencrypt-$CI_COMMIT_REF_SLUG \
# --set certificate.email=support@colmena.network \
# --set ingress.tls[0].secretName=$HOST_URL,ingress.tls[0].hosts=$HOST_URL \
# --set ingress.hosts[0].host=$HOST_URL,ingress.hosts[1].paths[0].path=/,ingress.hosts[1].paths[0].pathType=ImplementationSpecific \



helm upgrade --install --debug $CI_COMMIT_REF_SLUG chart \
--set image.tag=$CI_COMMIT_BRANCH \
--set image.repository=$CI_REGISTRY_IMAGE \
-f ./chart/env-values.yaml \
-n $KUBE_NAMESPACE \
--set serviceAccount.annotations."app\.gilab\.com\/env"=testk8 \
--set serviceAccount.annotations."app\.gilab\.com\/app"=maia-frontend \
--set certificate.issuer_name=letsencrypt-$CI_COMMIT_REF_SLUG \
--set certificate.name=$HOST_URL \
--set certificate.email=support@colmena.network \
--set ingress.tls[0].secretName=$HOST_URL,ingress.tls[0].hosts=$HOST_URL \
--set service.port=80,service.type=ClusteIP \
--set ingress.hosts[0].host=$HOST_URL,ingress.hosts[1].paths[0].path=/,ingress.hosts[1].paths[0].pathType=ImplementationSpecific \