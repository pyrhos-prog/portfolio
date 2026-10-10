---
title: "Threat Intelligence Dashboard & Honeypot Analytics"
slug: "threat-intelligence-dashboard"
date: "2026-05-26"
category: "Threat Intel / SIEM"
tags: ["threat-intel", "grafana", "geoip", "loki", "siem", "python"]
difficulty: "Medio"
featured: true
summary: "Visualización geoespacial de vectores de ataque globales, análisis de credenciales comprometidas y métricas de fuerza bruta SSH en tiempo real."
github: "https://github.com/pyrhos/threat-intel-dashboard"
---

# Threat Intelligence Dashboard & Honeypot Analytics

Panel avanzado de telemetría y correlación de eventos enfocado en la monitorización de ataques dirigidos y tráfico malicioso proveniente de botnets y escáneres masivos de Internet.

## 🎯 Objetivos del Sistema

1. **Detección temprana:** Identificación de IPs con patrones recurrentes de escaneo de puertos.
2. **Análisis de diccionarios:** Extracción automatizada de los nombres de usuario y contraseñas más utilizados por bots.
3. **Mapeo geográfico:** Visualización en mapa del origen de las conexiones entrantes mediante enriquecimiento GeoIP.

## 📊 Métricas Clave Monitorizadas

- **Total de intentos de login:** Récord por franjas horarias y días de la semana.
- **Top 10 ASN y Países atacantes:** Clasificación de rangos de red hostiles.
- **Comandos ejecutados en el Honeypot:** Registro forense de comandos intentados por atacantes una vez acceden al falso entorno SSH.

```bash
# Extracción de comandos sospechosos desde logs de Loki mediante logcli
logcli query '{job="cowrie"} |= "cowrie.command.input"' --limit=100
```

## 🛡️ Lecciones Aprendidas

- Más del 85% del tráfico malicioso corresponde a bots automatizados buscando credenciales por defecto (`root/root`, `admin/admin123`).
- El uso de iptables para redirigir puertos permite mantener el acceso administrativo real oculto y seguro sin perturbar la captura del honeypot.
