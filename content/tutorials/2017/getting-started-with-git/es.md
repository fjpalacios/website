---
title: "Primeros pasos con Git"
post_slug: "primeros-pasos-con-git"
date: "2017-11-05T15:16:32.000Z"
excerpt: "¿Quieres hacer tu primer commit en Git? En estos primeros pasos con
esta herramienta te explicamos cómo."
categories:
  - "tutoriales"
i18n: ""
tutorial: "git"
course: "domina-git-desde-cero"
cover: "../../default.jpg"
---

Ya sabemos [qué es Git](/que-es-git/) y hemos aprendido a [instalarlo en
nuestro sistema operativo](/como-instalar-git-en-linux-macos-y-windows/). Así
que vamos a empezar a sacarle partido empezando a utilizarlo como lo que es: un
sistema de control de versiones, así que vamos a empezar a trabajar con archivos
y diferentes versiones de los mismos para que apreciemos la utilidad real de
esta herramienta. 🙂

A partir de ahora todos los comandos para cambiar de directorio, para editar
archivos, crear carpetas, archivos, etc, serán válidos para entornos Unix; si
utilizas Windows tienes tres opciones: puedes ignorar esos comandos y quedarte
únicamente con los de Git (que ya dijimos que eran válidos para cualquier
sistema operativo) haciendo todo lo demás en entorno gráfico; *traducirlos* a
sus respectivas versiones de `cmd.exe` o PowerShell o, por último, la que os
recomendaría encarcidamente: [instalar Cygwin](http://www.cygwin.com/), un
*emulador* de terminal Unix, desde la cual se puede trabajar en Windows como si
estuvieses introduciendo comandos en sistemas Unix; la aplicación se encarga de
hacer las conversiones oportunas a sus comandos equivalentes, totalmente
transparente para el usuario.

```shell
mkdir git-tutorial
cd git-tutorial
git init
```

Lo que estamos haciendo con esto es: con `mkdir` creamos una carpeta en la que
estará todo nuestro proyecto (en este caso nada más este tutorial), con `cd`
entramos en ella y con `git init` le *decimos* a Git que queremos que inicie un
nuevo control de versiones en esta carpeta. Al hacer esto, en sistemas Unix
podemos ver mediante el comando `ls -a` que se ha creado una carpeta oculta con
nombre `.git` (en Windows también está oculta, pero a su forma) y es aquí donde
irá guardándose la *línea temporal* con todas las modificaciones que vayamos
haciendo a los archivos que estén en su interior. Si ahora escribimos `git
status` veremos que nos aparece este mensaje:

```git
On branch master
No commits yet
nothing to commit (create/copy files and use "git add" to track)
```

Más adelante veremos qué es un *branch* (una rama), pero ejecutar este comando
ahora es una buena idea para que sepamos que todo funciona correctamente. Para
empezar vamos a crear un archivo HTML con la estructura básica de HTML5, si no
sabéis HTML no os preocupéis porque ahora eso no es importante, cualquier
contenido para ese archivo valdría.

```shell
touch index.html
vim index.html
```

Con el comando `touch` creamos el archivo y con `vim` abrimos el archivo con el
editor de textos vim (si no os gusta vim pues otro cualquiera; y si no con
entorno gráfico, a gusto de cada cual). Dentro de él introducimos, por poner
algo, lo siguiente:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Our wonderful Git tutorial</title>
</head>
<body>
    <h1>Getting started with Git</h1>
</body>
</html>
```

Y ahora, de nuevo, si ejecutamos el comando `git status` veremos lo siguiente:

```git
On branch master
No commits yet
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html
nothing added to commit but untracked files present (use "git add" to track)
```
Y, si aparece esto, significará que todo salió según lo previsto. Si prestamos
atención a lo que nos dice sabremos que se han creado nuevos archivos (en
nuestro caso sólo uno) pero todavía no le hemos dicho a Git que queremos que
*añada* esos archivos a la *cola* para incluirlos en el próximo *commit*, por
tanto él no sabe si lo que hemos hecho con ese archivo queremos que sea incluido
o no. Podemos introducir el comando: `git add index.html` para añadirlo, aunque
si tenemos varios archivos y queremos incluir todos ellos bastaría con un `git
add .` para hacerle saber a Git que queremos añadir al próximo *commit* todos
los archivos que actualmente hay creados o modificados. Y si después de
cualquiera de estos dos comandos volvemos a introducir el comando `git status`
veremos lo siguiente:

```git
On branch master
No commits yet
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   index.html
```

Ahora llegamos a un paso muy importante, el archiconocido *commit*. En Git, un
*commit* es cuando guardas definitivamente un cambio en la *línea temporal*. Los
*commits* son gratuitos, por tanto, y para que el uso de Git sea plenamente
satisfactorio, hay que hacer un *commit* por cada vez que se implementa algo,
cada vez que se hace un cambio o se procede a la corrección de algún bug
(esperemos que de éstos no hayan muchos :P). Y es precisamente esto lo que hace
de los sistemas de control de versiones una herramienta tan potente: poder
regresar (o revertir) esa cosa concreta en cualquier momento si vemos que no
funciona como esperábamos que funcionase; si en un mismo *commit* cambiamos
cosas no relacionadas, si después queremos revertir esos cambios se revertirán
todos ellos a la vez, con lo cual puede que se reviertan algunos que realmente
no queríamos revertir. Para escribir nuestro primer *commit* podemos hacerlo con
este comando: `git commit -m "Initial commit"` y la respuesta que nos dará el
sistema será algo similar a esto:

```git
[master (root-commit) 2fdbe1d] Initial commit
 1 file changed, 12 insertions(+)
 create mode 100644 index.html
```

Y con esto ya hemos guardado nuestro primer cambio, para que en caso de que algo
no haya salido bien (vale, es complicado que en este momento nuestro *gran*
archivo HTML contenga algún error, pero…) podamos revertir los cambios sin tener
que recordar cómo estaba antes de este último cambio. Quizá ahora aún no le
veáis sentido a utilizar una herramienta de control de versiones, pero tened en
cuenta que éste es un proyecto minúsculo de ejemplo, hay que pensar en grande,
en el futuro… ¿Qué tal un proyecto algo menos modesto, de unos 20 archivos con
unas 800 líneas de código por archivo? Creedme cuando os aseguro que en ese caso
es enormemente útil utilizar una herramienta de este tipo.

Si queréis entender en profundidad lo que hemos hecho hasta ahora es necesario
entender [los tres estados de Git](/los-tres-estados-de-git/), os
animo a leer el artículo.

Por último, tanto éste como los demás archivos que vayamos creando o modificando
para este curso de Git podréis verlos en el repositorio para el [tutorial de
Git](https://github.com/sargantanacode/git-tutorial) que hay creado en [nuestro
repositorio de GitHub](https://github.com/sargantanacode).

Y recordad… ¡Nunca dejéis de programar!
