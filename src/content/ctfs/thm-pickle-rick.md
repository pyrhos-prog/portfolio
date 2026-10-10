---
title: "Pickle Rick - TryHackMe"
slug: "thm-pickle-rick"
date: "2026-03-02"
platform: "TryHackMe"
category: "Linux / Web"
tags: ["command-injection", "sudo-all", "linux", "web-enumeration"]
difficulty: "Fácil"
featured: true
summary: "Explotación web rápida: inspección de código fuente para descubrir credenciales, bypass de filtros en panel de comandos y escalada inmediata con sudo."
flag_user: "THM{mr_m33s33ks_18374}"
flag_root: "THM{fl33b_ju1c3_c0mpl3t3}"
---

# Pickle Rick (TryHackMe)

Reto clásico de TryHackMe ambientado en Rick and Morty para practicar reconocimiento web y aprovechamiento de comandos del sistema.

---

## 1. Inspección Web

Al revisar el código fuente de la página de inicio encontramos un comentario HTML con el nombre de usuario:
```html
<!-- Note to self, remember username! username: R1ckRul3s -->
```

En el archivo `robots.txt`:
```
Wubbalubbadubdub
```

---

## 2. Panel de Administración y Bypass de Comandos

Iniciando sesión en `/login.php` con esas credenciales accedemos a `portal.php`, un panel para ejecutar comandos en el servidor. El comando `cat` está bloqueado por una lista negra.

Bypass usando `less`, `head` o `tail`:
```bash
less Sup3rS3cretPickl3Ingred.txt
```
Ingrediente 1 obtenido.

---

## 3. Escalada de Privilegios

Ejecutamos `sudo -l`:
```
Matching Defaults entries for www-data on rick-portal:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User www-data may run the following commands on rick-portal:
    (ALL) NOPASSWD: ALL
```

`www-data` tiene privilegios de ejecutar cualquier comando como root sin pedir contraseña:
```bash
sudo ls /root
sudo head /root/3rd.txt
```
Reto completado con éxito.
