---
title: "Honeypot Cowrie + Grafana Alloy + Loki"
slug: "honeypot-cowrie-grafana"
date: "2026-05-26"
category: "Blue Team / Infra"
tags: ["honeypot", "cowrie", "docker", "grafana", "loki", "alloy", "threat-intel"]
difficulty: "Medio"
featured: true
summary: "Despliegue y monitorización en tiempo real de ataques SSH/Telnet con Honeypot Cowrie, pipeline de logs con Grafana Alloy y Loki, y dashboards interactivos con geolocalización."
github: "https://github.com/pyrhos/honeypot-monitoring"
---

# Honeypot Cowrie + Grafana Alloy + Loki + Grafana
**VPS:** `109.199.113.250`


---

## Arquitectura

```
Internet → Puerto 22 (iptables redirect) → Cowrie :2222
                                            │
                                    cowrie.json logs
                                            │
                                      Grafana Alloy
                                      (GeoIP lookup)
                                            │
                                          Loki :3100
                                            │
                                       Grafana :3000
                                    (Dashboard + Mapa)
```

---

## 1. Preparación del servidor

```bash
# Instalar Docker y Docker Compose
apt update && apt upgrade -y
apt install -y docker.io docker-compose-v2 iptables-persistent curl

# Crear estructura de directorios
mkdir -p /opt/honeypot/{cowrie/etc,loki,alloy,grafana/{provisioning/{datasources,dashboards},dashboards}}
cd /opt/honeypot
```

---

## 2. Redirección del puerto SSH real

> ⚠️ **ANTES** de aplicar esto, asegúrate de que tu SSH real escucha en otro puerto.

```bash
# Cambiar el puerto SSH real a 2222 (temporalmente usamos 2222 para cowrie,
# así que usaremos 22222 para nuestro acceso)
sed -i 's/#Port 22/Port 22222/' /etc/ssh/sshd_config
systemctl restart sshd

# IMPORTANTE: Abre una nueva sesión SSH al puerto 22222 ANTES de continuar
# ssh -p 22222 root@109.199.113.250

# Redirigir el puerto 22 entrante a Cowrie (puerto 2222)
iptables -t nat -A PREROUTING -p tcp --dport 22 -j REDIRECT --to-port 2222
iptables -t nat -A PREROUTING -p tcp --dport 23 -j REDIRECT --to-port 2223

# Guardar reglas para que persistan tras reinicios
netfilter-persistent save
```

---

## 3. Base de datos GeoIP (MaxMind GeoLite2)

Necesitas registrarte gratis en [maxmind.com](https://www.maxmind.com/en/geolite2/signup) para obtener la base de datos GeoLite2.

```bash
# Opción A: Con cuenta MaxMind (recomendado)
apt install -y geoipupdate
# Edita /etc/GeoIP.conf con tu AccountID y LicenseKey de MaxMind
# Luego:
geoipupdate
cp /usr/share/GeoIP/GeoLite2-City.mmdb /opt/honeypot/alloy/

# Opción B: Descarga directa con tu License Key
# (sustituye ACCOUNT_ID y LICENSE_KEY)
curl -L "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=LICENSE_KEY&suffix=tar.gz" \
  | tar -xz --strip-components=1 -C /opt/honeypot/alloy/ "*/GeoLite2-City.mmdb"
```

---

## 4. Ficheros de configuración

### `docker-compose.yml`

```yaml
# /opt/honeypot/docker-compose.yml
services:

  cowrie:
    image: cowrie/cowrie:latest
    container_name: cowrie
    restart: unless-stopped
    ports:
      - "2222:2222"   # SSH honeypot
      - "2223:2223"   # Telnet honeypot
    volumes:
      - ./cowrie/etc/cowrie.cfg:/cowrie/etc/cowrie.cfg:ro
      - cowrie-logs:/cowrie/var/log/cowrie
    environment:
      - COWRIE_TELNET_ENABLED=yes

  loki:
    image: grafana/loki:3.1.0
    container_name: loki
    restart: unless-stopped
    ports:
      - "127.0.0.1:3100:3100"
    volumes:
      - ./loki/loki-config.yaml:/etc/loki/local-config.yaml:ro
      - loki-data:/loki
    command: -config.file=/etc/loki/local-config.yaml

  alloy:
    image: grafana/alloy:latest
    container_name: alloy
    restart: unless-stopped
    volumes:
      - ./alloy/config.alloy:/etc/alloy/config.alloy:ro
      - ./alloy/GeoLite2-City.mmdb:/etc/alloy/GeoLite2-City.mmdb:ro
      - cowrie-logs:/cowrie-logs:ro
    command: run --server.http.listen-addr=0.0.0.0:12345 /etc/alloy/config.alloy
    ports:
      - "127.0.0.1:12345:12345"
    depends_on:
      - loki

  grafana:
    image: grafana/grafana:11.2.0
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
      - ./grafana/dashboards:/var/lib/grafana/dashboards:ro
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=HoneypotAdmin2024!
      - GF_SERVER_ROOT_URL=http://109.199.113.250:3000
      - GF_FEATURE_TOGGLES_ENABLE=publicDashboards
    depends_on:
      - loki

volumes:
  cowrie-logs:
  loki-data:
  grafana-data:
```

---

### `cowrie/etc/cowrie.cfg`

```ini
# /opt/honeypot/cowrie/etc/cowrie.cfg
[honeypot]
hostname = ubuntu-server
log_path = var/log/cowrie
download_path = var/lib/cowrie/downloads
share_path = share/cowrie
state_path = var/lib/cowrie
etc_path = etc
contents_path = honeyfs
txtcmds_path = txtcmds
ttylog = true
ttylog_path = var/lib/cowrie/tty

# Apariencia realista
kernel_version = 5.15.0-91-generic
kernel_build_string = #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023
hardware_platform = x86_64
operating_system = GNU/Linux

# Usuarios y contraseñas que "acepta" el honeypot
# (para engañar al atacante haciéndole pensar que entró)
auth_class = UserDB

# Tiempo de respuesta para simular servidor lento
# (retiene más tiempo a los atacantes)
login_unsuccessful_count = 10
login_unsuccessful_count_valid = 10

[output_jsonlog]
enabled = true
logfile = var/log/cowrie/cowrie.json

[output_textlog]
enabled = true
logfile = var/log/cowrie/cowrie.log

[ssh]
enabled = true
listen_endpoints = tcp:2222:interface=0.0.0.0
version = SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6

[telnet]
enabled = true
listen_endpoints = tcp:2223:interface=0.0.0.0
```

---

### `loki/loki-config.yaml`

```yaml
# /opt/honeypot/loki/loki-config.yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  instance_addr: 127.0.0.1
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2024-01-01
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

limits_config:
  # Permitir alta cardinalidad para IPs de atacantes
  max_label_names_per_series: 30
  ingestion_rate_mb: 16
  ingestion_burst_size_mb: 32

ruler:
  alertmanager_url: http://localhost:9093
```

---

### `alloy/config.alloy`

```hcl
// /opt/honeypot/alloy/config.alloy

// ── Leer logs JSON de Cowrie ───────────────────────────────────────────────
loki.source.file "cowrie_json" {
  targets = [
    {
      __path__ = "/cowrie-logs/cowrie.json",
      job      = "cowrie",
    },
  ]
  forward_to = [loki.process.cowrie_pipeline.receiver]
}

// ── Pipeline de procesamiento ──────────────────────────────────────────────
loki.process "cowrie_pipeline" {

  // 1. Parsear el JSON del log de Cowrie
  stage.json {
    expressions = {
      eventid   = "eventid",
      src_ip    = "src_ip",
      username  = "username",
      password  = "password",
      session   = "session",
      message   = "message",
      ts        = "timestamp",
    }
  }

  // 2. Lookup GeoIP para obtener país y coordenadas
  stage.geoip {
    db      = "/etc/alloy/GeoLite2-City.mmdb"
    source  = "src_ip"
    db_type = "city"
    // Genera: geoip_country_name, geoip_country_code,
    //         geoip_city, geoip_latitude, geoip_longitude
  }

  // 3. Labels de baja cardinalidad (para filtrado en Loki)
  stage.labels {
    values = {
      eventid      = "",
      country      = "geoip_country_name",
      country_code = "geoip_country_code",
    }
  }

  // 4. Metadatos estructurados (alta cardinalidad: IPs, coords, credenciales)
  stage.structured_metadata {
    values = {
      src_ip    = "",
      username  = "",
      password  = "",
      session   = "",
      city      = "geoip_city",
      latitude  = "geoip_latitude",
      longitude = "geoip_longitude",
    }
  }

  // 5. Timestamp desde el log de Cowrie
  stage.timestamp {
    source = "ts"
    format = "RFC3339"
  }

  forward_to = [loki.write.loki_backend.receiver]
}

// ── Enviar a Loki ──────────────────────────────────────────────────────────
loki.write "loki_backend" {
  endpoint {
    url = "http://loki:3100/loki/api/v1/push"
  }
}
```

---

### `grafana/provisioning/datasources/loki.yaml`

```yaml
# /opt/honeypot/grafana/provisioning/datasources/loki.yaml
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: true
    jsonData:
      maxLines: 5000
      derivedFields:
        - name: src_ip
          matcherRegex: '"src_ip":"([^"]+)"'
          url: 'https://ipinfo.io/${__value.raw}'
          urlDisplayLabel: 'IP Info'
```

---

### `grafana/provisioning/dashboards/dashboard.yaml`

```yaml
# /opt/honeypot/grafana/provisioning/dashboards/dashboard.yaml
apiVersion: 1

providers:
  - name: Cowrie Honeypot
    orgId: 1
    folder: Honeypot
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
```

---

### `grafana/dashboards/cowrie.json`

```json
{
  "title": "🍯 Cowrie Honeypot — Attack Dashboard",
  "uid": "cowrie-honeypot-main",
  "schemaVersion": 39,
  "version": 1,
  "refresh": "30s",
  "time": { "from": "now-24h", "to": "now" },
  "tags": ["honeypot", "cowrie", "security"],
  "panels": [
    {
      "id": 1,
      "title": "🌍 Mapa de Ataques",
      "type": "geomap",
      "gridPos": { "x": 0, "y": 0, "w": 24, "h": 12 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": {
        "view": { "id": "zero", "lat": 20, "lon": 0, "zoom": 2 },
        "layers": [
          {
            "type": "markers",
            "name": "Ataques",
            "config": {
              "style": {
                "color": { "fixed": "red" },
                "size": { "fixed": 5 },
                "opacity": 0.7
              }
            },
            "location": {
              "mode": "coords",
              "latitude": "latitude",
              "longitude": "longitude"
            }
          }
        ],
        "basemap": { "type": "default", "config": {} },
        "controls": {
          "showZoom": true,
          "mouseWheelZoom": true,
          "showAttribution": true,
          "showScale": false,
          "showDebug": false
        }
      },
      "targets": [
        {
          "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
          "expr": "{job=\"cowrie\", eventid=\"cowrie.login.failed\"} | json | latitude != \"\" | longitude != \"\"",
          "queryType": "range",
          "legendFormat": ""
        }
      ]
    },
    {
      "id": 2,
      "title": "🔴 Intentos de Login (últimas 24h)",
      "type": "stat",
      "gridPos": { "x": 0, "y": 12, "w": 6, "h": 4 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": {
        "colorMode": "background",
        "graphMode": "area",
        "textMode": "auto",
        "reduceOptions": { "calcs": ["sum"] }
      },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "thresholds" },
          "thresholds": {
            "steps": [
              { "color": "green", "value": 0 },
              { "color": "yellow", "value": 100 },
              { "color": "red", "value": 1000 }
            ]
          },
          "unit": "short"
        }
      },
      "targets": [
        {
          "expr": "sum(count_over_time({job=\"cowrie\", eventid=\"cowrie.login.failed\"}[24h]))",
          "legendFormat": "Fallos de login"
        }
      ]
    },
    {
      "id": 3,
      "title": "✅ Logins Exitosos (honeypot engañó al atacante)",
      "type": "stat",
      "gridPos": { "x": 6, "y": 12, "w": 6, "h": 4 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": {
        "colorMode": "background",
        "reduceOptions": { "calcs": ["sum"] }
      },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "thresholds" },
          "thresholds": {
            "steps": [
              { "color": "green", "value": 0 },
              { "color": "orange", "value": 10 },
              { "color": "red", "value": 50 }
            ]
          }
        }
      },
      "targets": [
        {
          "expr": "sum(count_over_time({job=\"cowrie\", eventid=\"cowrie.login.success\"}[24h]))",
          "legendFormat": "Logins exitosos"
        }
      ]
    },
    {
      "id": 4,
      "title": "🌐 IPs Únicas Atacantes",
      "type": "stat",
      "gridPos": { "x": 12, "y": 12, "w": 6, "h": 4 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": { "reduceOptions": { "calcs": ["lastNotNull"] } },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "thresholds" },
          "thresholds": {
            "steps": [
              { "color": "blue", "value": 0 },
              { "color": "orange", "value": 100 },
              { "color": "red", "value": 1000 }
            ]
          }
        }
      },
      "targets": [
        {
          "expr": "count(count by (src_ip) ({job=\"cowrie\"} | json | src_ip != \"\"))",
          "legendFormat": "IPs únicas"
        }
      ]
    },
    {
      "id": 5,
      "title": "📡 Sesiones Activas",
      "type": "stat",
      "gridPos": { "x": 18, "y": 12, "w": 6, "h": 4 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": { "reduceOptions": { "calcs": ["lastNotNull"] } },
      "fieldConfig": {
        "defaults": { "color": { "mode": "fixed", "fixedColor": "purple" } }
      },
      "targets": [
        {
          "expr": "sum(count_over_time({job=\"cowrie\", eventid=\"cowrie.session.connect\"}[5m]))",
          "legendFormat": "Sesiones"
        }
      ]
    },
    {
      "id": 6,
      "title": "📈 Ataques por Hora",
      "type": "timeseries",
      "gridPos": { "x": 0, "y": 16, "w": 16, "h": 8 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": {
        "legend": { "displayMode": "list", "placement": "bottom" }
      },
      "fieldConfig": {
        "defaults": {
          "custom": {
            "lineWidth": 2,
            "fillOpacity": 15,
            "spanNulls": false
          },
          "color": { "mode": "palette-classic" }
        }
      },
      "targets": [
        {
          "expr": "sum(count_over_time({job=\"cowrie\", eventid=\"cowrie.login.failed\"}[1h]))",
          "legendFormat": "Login fallido"
        },
        {
          "expr": "sum(count_over_time({job=\"cowrie\", eventid=\"cowrie.login.success\"}[1h]))",
          "legendFormat": "Login exitoso"
        },
        {
          "expr": "sum(count_over_time({job=\"cowrie\", eventid=\"cowrie.session.connect\"}[1h]))",
          "legendFormat": "Conexiones"
        }
      ]
    },
    {
      "id": 7,
      "title": "🏴 Top Países Atacantes",
      "type": "bargauge",
      "gridPos": { "x": 16, "y": 16, "w": 8, "h": 8 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": {
        "orientation": "horizontal",
        "reduceOptions": { "calcs": ["sum"] },
        "displayMode": "gradient"
      },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "continuous-BlPu" },
          "unit": "short"
        }
      },
      "targets": [
        {
          "expr": "sum by (country) (count_over_time({job=\"cowrie\", eventid=\"cowrie.login.failed\"}[24h]))",
          "legendFormat": "{{country}}"
        }
      ]
    },
    {
      "id": 8,
      "title": "🔑 Top Usuarios Probados",
      "type": "table",
      "gridPos": { "x": 0, "y": 24, "w": 12, "h": 8 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": {
        "sortBy": [{ "displayName": "Intentos", "desc": true }]
      },
      "targets": [
        {
          "expr": "{job=\"cowrie\", eventid=\"cowrie.login.failed\"} | json | username != \"\" | line_format \"{{.username}}\"",
          "legendFormat": "{{username}}"
        }
      ]
    },
    {
      "id": 9,
      "title": "🔐 Top Contraseñas Probadas",
      "type": "table",
      "gridPos": { "x": 12, "y": 24, "w": 12, "h": 8 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "targets": [
        {
          "expr": "{job=\"cowrie\", eventid=\"cowrie.login.failed\"} | json | password != \"\" | line_format \"{{.password}}\"",
          "legendFormat": "{{password}}"
        }
      ]
    },
    {
      "id": 10,
      "title": "📋 Log en Tiempo Real",
      "type": "logs",
      "gridPos": { "x": 0, "y": 32, "w": 24, "h": 8 },
      "datasource": { "type": "loki", "uid": "${DS_LOKI}" },
      "options": {
        "dedupStrategy": "none",
        "enableLogDetails": true,
        "prettifyLogMessage": true,
        "showTime": true,
        "wrapLogMessage": true,
        "sortOrder": "Descending"
      },
      "targets": [
        {
          "expr": "{job=\"cowrie\"} | json",
          "legendFormat": ""
        }
      ]
    }
  ],
  "templating": {
    "list": []
  }
}
```

---

## 5. Script de despliegue

Crea el fichero `/opt/honeypot/deploy.sh`:

```bash
#!/bin/bash
# /opt/honeypot/deploy.sh
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🍯 Desplegando Honeypot Cowrie + Grafana"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd /opt/honeypot

# Verificar que existe la BBDD GeoIP
if [ ! -f "alloy/GeoLite2-City.mmdb" ]; then
  echo "❌ ERROR: Falta alloy/GeoLite2-City.mmdb"
  echo "   Descárgala de https://www.maxmind.com/en/geolite2/signup"
  exit 1
fi

# Arrancar servicios
docker compose pull
docker compose up -d

echo ""
echo "✅ Servicios arrancados:"
docker compose ps

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Grafana: http://109.199.113.250:3000"
echo "  Usuario: admin"
echo "  Password: HoneypotAdmin2024!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

```bash
chmod +x /opt/honeypot/deploy.sh
```

---

## 6. Despliegue

```bash
cd /opt/honeypot

# Verificar estructura de directorios
tree /opt/honeypot
# ├── docker-compose.yml
# ├── cowrie/
# │   └── etc/cowrie.cfg
# ├── loki/
# │   └── loki-config.yaml
# ├── alloy/
# │   ├── config.alloy
# │   └── GeoLite2-City.mmdb  ← debes bajarlo tú
# └── grafana/
#     ├── provisioning/
#     │   ├── datasources/loki.yaml
#     │   └── dashboards/dashboard.yaml
#     └── dashboards/
#         └── cowrie.json

./deploy.sh
```

---

## 7. Configuración del firewall

```bash
# Abrir solo los puertos necesarios
ufw allow 22222/tcp comment "SSH real"
ufw allow 3000/tcp  comment "Grafana"
ufw allow 22/tcp    comment "Cowrie SSH honeypot"
ufw allow 23/tcp    comment "Cowrie Telnet honeypot"

# Bloquear acceso externo a Loki y Alloy (ya están en 127.0.0.1)
ufw enable

# Verificar iptables redirect
iptables -t nat -L PREROUTING -n --line-numbers
```

---

## 8. Verificación

```bash
# Ver logs en tiempo real
docker compose logs -f cowrie
docker compose logs -f alloy
docker compose logs -f loki

# Probar el honeypot manualmente
ssh -p 22 test@109.199.113.250
# (intentar credenciales: root/root, admin/admin, etc.)

# Ver logs generados
docker compose exec cowrie tail -f var/log/cowrie/cowrie.json | python3 -m json.tool

# Verificar que Alloy envía a Loki
curl -s "http://localhost:3100/loki/api/v1/query?query={job=\"cowrie\"}" | python3 -m json.tool
```

---

## 9. Dashboard en Grafana

1. Abre `http://109.199.113.250:3000`
2. Login: `admin` / `HoneypotAdmin2024!`
3. Ve a **Dashboards → Honeypot → Cowrie Honeypot**
4. El **mapa de ataques** aparece automáticamente usando las coordenadas GeoIP

### Ajuste manual del panel Geomap (si la latitud/longitud no aparece)

En el panel "Mapa de Ataques", en la configuración de la capa:
- **Location**: `Coords`
- **Latitude field**: `latitude`  
- **Longitude field**: `longitude`

---

## 10. Mantenimiento

```bash
# Ver estadísticas rápidas de ataques
docker compose exec cowrie grep -c '"eventid": "cowrie.login.failed"' var/log/cowrie/cowrie.json

# Actualizar GeoIP mensualmente
geoipupdate && docker compose restart alloy

# Ver top IPs atacantes
docker compose exec cowrie \
  python3 -c "
import json
from collections import Counter
ips = []
with open('var/log/cowrie/cowrie.json') as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get('src_ip'):
                ips.append(d['src_ip'])
        except: pass
for ip, n in Counter(ips).most_common(20):
    print(f'{n:6d}  {ip}')
"

# Actualizar imágenes Docker
docker compose pull && docker compose up -d
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Cowrie no recibe conexiones | Verificar `iptables -t nat -L PREROUTING` |
| Alloy no envía logs | Comprobar que `/cowrie-logs/cowrie.json` existe en el volumen |
| Mapa sin datos | Verificar que `GeoLite2-City.mmdb` está en `alloy/` |
| Grafana sin datasource | Reiniciar con `docker compose restart grafana` |
| Loki 413 error | Aumentar `ingestion_burst_size_mb` en loki-config.yaml |

---

> **Nota legal:** Este honeypot recopila datos de atacantes. Úsalo solo en infraestructura propia. Los datos capturados (IPs, credenciales probadas) son solo para análisis defensivo.
