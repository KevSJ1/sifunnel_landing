#!/usr/bin/env bash
# Uso: ./deploy/deploy.sh usuario@ip-del-vps
# Construye la imagen, la copia por SSH y reinicia el contenedor en el VPS.
set -euo pipefail
VPS="${1:?Uso: $0 usuario@host}"
IMG=sifunnel-landing:latest

docker build -t "$IMG" .
docker save "$IMG" | gzip | ssh "$VPS" 'gunzip | docker load'
ssh "$VPS" "docker rm -f sifunnel-landing 2>/dev/null || true; \
  docker run -d --name sifunnel-landing --restart unless-stopped -p 127.0.0.1:8080:80 $IMG"
echo "Listo. Probar en el VPS: curl -I http://127.0.0.1:8080"
