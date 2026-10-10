---
title: "Recon Dossier Engine (oracle-foundation)"
slug: "recon-dossier-engine"
date: "2025-01-10"
category: "OSINT / Recon"
tags: ["fastapi", "sqlalchemy", "pydantic", "postgresql", "osint", "nuclei"]
difficulty: "Medio"
featured: true
summary: "Motor de agregación y correlación de inteligencia OSINT sobre FastAPI y PostgreSQL 16 con modelo relacional de 8 tablas y pipeline modular de reconocimiento (subfinder → httpx → naabu → nuclei)."
github: "https://github.com/pyrhos-prog"
---

# Recon Dossier Engine (módulo: oracle-foundation)

Motor modular de agregación, correlación y almacenamiento de telemetría de reconocimiento de superficie de ataque (Attack Surface Management - ASM) y fuentes abiertas (OSINT).

---

## 🗄️ Modelo Relacional de Base de Datos

Desarrollado con **SQLAlchemy 2.0**, **Pydantic v2** y control de migraciones automatizadas con **Alembic** sobre PostgreSQL 16:

1. `engagements`: Contexto de la auditoría y reglas de engagement.
2. `entities`: Entidades identificadas (dominios, IPs, organizaciones, personas).
3. `attributes`: Propiedades específicas (puertos abiertos, certificados SSL, tecnologías web).
4. `relationships`: Aristas de conexión entre entidades (pertenencia, resolución DNS, reverse IP).
5. `sources`: Trazabilidad del origen de los datos (Shodan, FOFA, escaneos activos).
6. `collection_jobs`: Trabajos de recolección en segundo plano y estado de tareas.
7. `api_keys`: Gestión de credenciales seguras de servicios externos.
8. `audit_log`: Registro inmutable de actividades y modificaciones para auditoría.

---

## 🚀 Pipeline de Reconocimiento Modular

El pipeline orquesta secuencialmente herramientas de alto rendimiento:

```bash
# 1. Enumeración de subdominios
subfinder -d target.com -all -silent | \
# 2. Resolución y detección HTTP/HTTPS activa
httpx -silent -status-code -title -tech-detect | \
# 3. Escaneo rápido de puertos expuestos
naabu -silent -p - | \
# 4. Análisis automatizado de vulnerabilidades conocidas
nuclei -t cves/ -silent
```
