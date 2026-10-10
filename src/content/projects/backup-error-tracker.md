---
title: "Backup Error Tracker"
slug: "backup-error-tracker"
date: "2024-09-20"
category: "Sysadmin / Automatización"
tags: ["flask", "sqlite", "javascript", "rest-api", "msp360", "datos101"]
difficulty: "Fácil"
featured: true
summary: "Herramienta interna desarrollada y desplegada en producción para EVOLK SL: monitorización centralizada y triaje automático de incidencias en backups mediante APIs de Datos101 y MSP360."
github: "https://github.com/pyrhos-prog"
---

# Backup Error Tracker

Herramienta interna desarrollada para resolver la saturación de alertas y la dispersión de paneles de copias de seguridad en un entorno de proveedor de servicios gestionados (MSSP).

---

## 💡 El Problema Resuelto

Los técnicos de soporte debían consultar manualmente múltiples plataformas de backup independientes (Datos101 y MSP360 CloudBerry) para verificar cientos de servidores y puestos de trabajo de clientes. Esto consumía más de 2 horas diarias y aumentaba el riesgo de no detectar a tiempo copias fallidas.

---

## 🛠️ Solución Técnica Implementada

- **Backend:** Microservicio ligero en **Python (Flask)** que consume periódicamente las APIs REST de los proveedores.
- **Base de Datos:** **SQLite** optimizado con índices para persistir el historial de alertas y estados de ejecución.
- **Frontend:** Panel de control responsivo en **JavaScript vanilla**, HTML y CSS puro, con filtros dinámicos por cliente, severidad y tipo de error.
- **Resultados en Producción:** Reducción del tiempo diario de revisión en un 80% y respuesta inmediata ante fallos de integridad o falta de cuota en almacenamiento.
