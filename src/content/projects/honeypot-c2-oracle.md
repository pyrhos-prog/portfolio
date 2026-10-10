---
title: "Infraestructura de Honeypots & C2 Persistente"
slug: "honeypot-c2-oracle"
date: "2024-10-05"
category: "Red Team / Infra"
tags: ["honeypot", "tpot", "cowrie", "sliver-c2", "oracle-cloud", "loki", "alloy"]
difficulty: "Medio"
featured: true
summary: "Despliegue de red de sensores y señuelos (T-Pot + Cowrie) en VPS Oracle Cloud con telemetría en Grafana Alloy y Loki, junto a infraestructura C2 con Sliver bajo systemd persistente."
github: "https://pyrhos.gitbook.io"
---

# Infraestructura de Honeypots & C2 Persistente

Despliegue híbrido en VPS público de Oracle Cloud combinando capacidades de monitorización pasiva de amenazas externas (*Threat Intelligence*) y aprovisionamiento de infraestructura de Mando y Control (*C2*) para emulación de adversarios.

---

## 🍯 Despliegue de Honeypots (T-Pot & Cowrie)

- **Reto de bajo nivel:** Superación de restricciones de socket en tarjetas de red virtuales de hipervisor (`AF_PACKET`) en Oracle Cloud para permitir la escucha promiscua y captura íntegra de paquetes de red.
- **Canalización de Logs:** Envío en tiempo real de eventos de autenticación forzada, diccionarios de ataque y comandos intentados mediante **Grafana Alloy** hacia un servidor central **Loki**.
- **Visualización:** Paneles en Grafana con geolocalización de atacantes, top de ASNs maliciosos y técnicas MITRE ATT&CK observadas.

---

## ⚡ Infraestructura de Command & Control (Sliver C2)

- Configuración y securización del framework **Sliver C2** como servicio persistente en **systemd**.
- Canales de comunicación con agentes a través de mTLS y DNS beaconing.
- Endurecimiento del host perimetral mediante reglas estrictas de iptables y redirección de puertos SSH reales a puertos altos.
