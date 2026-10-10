---
title: "Laboratorio Active Directory: evilcorp.local"
slug: "ad-evilcorp-lab"
date: "2024-11-15"
category: "Red Team / AD"
tags: ["active-directory", "bloodhound", "responder", "netexec", "proxmox", "kerberos"]
difficulty: "Difícil"
featured: true
summary: "Entorno corporativo AD desplegado sobre Proxmox VE con simulación completa de ataques: LLMNR poisoning, SMB Relay, abuso de ACLs y cadenas GenericAll hacia Domain Admin."
github: "https://pyrhos.gitbook.io"
---

# Laboratorio Active Directory: evilcorp.local

Entorno corporativo multiservidor desplegado y aprovisionado sobre hipervisor **Proxmox VE**, concebido para la investigación y práctica de técnicas avanzadas de ataque y defensa sobre Directorio Activo (Active Directory) de Microsoft.

---

## 🎯 Escenario y Arquitectura de Red

- **Hipervisor:** Proxmox VE en hardware dedicado con switches virtuales y VLANs aisladas.
- **Controlador de Dominio (DC):** Windows Server 2022 (`DC01.evilcorp.local`).
- **Servidores Miembro y Workstations:** Windows 10 Enterprise y Windows Server (Servidor de archivos / IIS).
- **Máquina Atacante:** Linux (CachyOS) con toolkit ofensivo.

---

## ⚔️ Cadena de Ataque Simulada (Attack Path)

1. **Intrusión y Envenenamiento de Red Interna:**
   - Captura de hashes NTLMv2 mediante **Responder** aprovechando peticiones de resolución `LLMNR` y `NBT-NS`.
   - Ataques de **SMB Relay** con `ntlmrelayx` hacia equipos con firma SMB (*SMB Signing*) desactivada.

2. **Enumeración y Mapeo de Relaciones de Confianza:**
   - Enumeración exhaustiva de usuarios, grupos y políticas de contraseñas mediante **NetExec (NXC)**.
   - Recolección de telemetría de objetos y DACLs con **SharpHound** y análisis visual de vectores de ataque en **BloodHound**.

3. **Escalada de Privilegios por Abuso de ACLs:**
   - Detección de permiso `GenericAll` desde el grupo `Helpdesk` hacia una cuenta de servicio intermedia (`it-admin`).
   - Restablecimiento de contraseña de la cuenta intermedia y posterior abuso de permisos para escalar a **Domain Admins**.

```bash
# Reconocimiento y escaneo en 2 fases con Nmap
nmap -p- --open -sS --min-rate 3000 -n -Pn 192.168.10.10 -oN allPorts.txt
nmap -sCV -p 53,88,135,139,389,445,464,593,636,3268,3269 192.168.10.10 -oN adServices.txt

# Ejecución de Relay sin firma
ntlmrelayx.py -tf targets_no_signing.txt -smb2support -socks
```

---

## 🛡️ Mitigaciones Evaluadas

- Deshabilitación de LLMNR mediante GPO y desactivación de NetBIOS sobre TCP/IP.
- Activación forzada de SMB Signing y LDAP Signing.
- Principio de mínimo privilegio en delegaciones de ACLs sobre objetos del dominio.
