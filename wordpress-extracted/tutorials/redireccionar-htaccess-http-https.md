---
title: "Redireccionar mediante .htaccess de http a https"
date: "2016-04-05"
slug: "redireccionar-htaccess-http-https"
---

El otro día me surgió la necesidad de redireccionar una página web, desde su versión sin certificado SSL a su versión con él; para que aunque se accediera desde **http://** redireccionara automáticamente a **https://**; y caí en la cuenta de que esto, tan sencillo y útil, hasta ahora no pensé en escribir una guía rápida sobre cómo hacerlo.

## ¿Qué es .htaccess y cómo editarlo?

Si estás buscando información sobre esto doy por hecho que ya sabes qué es el archivo **.htaccess** y cómo editarlo, pero no obstante lo explicaré un poco por encima.

**.htaccess**, por así decirlo, es _un archivo de instrucciones_ al que [Apache](https://httpd.apache.org/) —el _programa_ encargado de que tu página web se muestre correctamente en internet—, en caso de estar creado, consulta cada vez que se accede a una página para ver si hay alguna instrucción especial sobre ella o no.

La forma de editarlo es igual que cualquier otro archivo de tu página web, pero con una excepción: en sistemas operativos basados en Unix los archivos que empiezan con un punto (_dotfiles_) son archivos ocultos; cualquier aplicación que utilices para acceder a tu página web por FTP podrá mostrarlos sin problemas, pero normalmente por defecto vienen ocultos, así que si no lo ves, antes de crear uno nuevo, asegúrate de localizar y activar la opción de **mostrar archivos ocultos** por las distintas opciones que aparezcan en los menús.

## Código para redireccionar mediante .htaccess

Si, tras asegurarte de que la opción **mostrar archivos ocultos** está activada, sigues sin ver ningún archivo **.htaccess**, créalo sin miedo; si ya existe archivo **.htaccess** pero está en blanco puedes pegar este código sin problema; si ya existe **.htaccess**, y tiene alguna línea, simplemente ignóralas y pon este código al final de lo que ya haya escrito.

El código que necesitas para que tu página web redireccione automáticamente a tus visitantes de http:// a https:// es este; y no necesitas reemplazar nada, sólo pégalo tal cual:

```apache
RewriteEngine on
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Ahora, como complemento extra: si quieres que cualquier página dentro de tu web cargue en modo seguro https:// salvo, por el motivo que sea, un directorio en concreto, el código sería este, pero reemplazando **mi_directorio** por el nombre real del mismo:

```apache
RewriteEngine on
RewriteCond %{HTTPS} off
RewriteCond %{REQUEST_URI} !mi_directorio [NC]
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Aprovechando la tesitura, si también quieres hacer desaparecer la inútil y arcaica **www.** de delante de tu dominio, justo debajo de cualquiera de los dos códigos anteriores debes pegar también este, sin reemplazar nada:

```apache
RewriteEngine on
RewriteBase /
RewriteCond %{HTTP_HOST} ^www\. [NC]
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Todos estos códigos añaden una **redirección 301**: redirección permanente. Lo que ayuda a que los distintos motores de búsqueda (como Google) empiecen a cambiar también, progresivamente, la antigua dirección por la nueva.

Cualquier duda, como siempre, la responderé con mucho gusto en los comentarios.
