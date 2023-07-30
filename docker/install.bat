@echo off

COPY  "%CD%\..\backend\package.json" "backend\package.json"
COPY  "%CD%\..\backend\package-lock.json" "backend\package-lock.json"
COPY  "%CD%\..\frontend\package.json" "frontend\package.json"
COPY  "%CD%\..\frontend\package-lock.json" "frontend\package-lock.json"
wait
docker-compose "up" "-d" "--build" "--force-recreate"
wait
DEL  "backend\package.json"
DEL  "backend\package-lock.json"
DEL  "frontend\package.json"
DEL  "frontend\package-lock.json"