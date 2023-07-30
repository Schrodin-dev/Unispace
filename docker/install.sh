#!/bin/bash

cp ../backend/package.json backend/package.json
cp ../backend/package-lock.json backend/package-lock.json
cp ../frontend/package.json frontend/package.json
cp ../frontend/package-lock.json frontend/package-lock.json
wait
docker-compose up -d --build --force-recreate
wait
rm backend/package.json
rm backend/package-lock.json
rm frontend/package.json
rm frontend/package-lock.json