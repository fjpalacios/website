---
title: "Cómo instalar Git en Linux, macOS y Windows"
post_slug: "como-instalar-git-en-linux-macos-y-windows"
date: "2017-10-31T18:05:55.000Z"
excerpt: "¿Quieres saber cómo instalar Git en Linux, macOS y Windows? Además,
también aprenderás los primeros comandos de Git para hacer las configuraciones
iniciales."
categories:
  - "tutoriales"
i18n: ""
tutorial: "git"
course: "domina-git-desde-cero"
cover: "../../default.jpg"
---

Ahora que sabéis [qué es Git](/es/article/what-is-git/) seguro que tenéis
muchísimas ganas de instalarlo en vuestros equipos, así que vamos a averiguar en
este artículo cómo instalarlo dependiendo de nuestro sistema operativo o de la
distribución de Linux que tengamos.

A lo largo de este curso no vamos a usar entorno gráfico para trabajar con Git,
porque la terminal es muchísimo más potente y nos da acceso a todo; en los
entornos gráficos disponibles siempre hay un acceso directo a la terminal,
porque son conscientes de que no es posible exprimir a fondo Git si no es de
esta forma. No obstante, tenéis que saber que existen interfaces gráficas, como
la que a mi juicio es más bonita, [GitHub Desktop](https://desktop.github.com/)
(sólo disponible para Mac y Windows), que como su nombre indica, está creada por
GitHub; con ella es posibles gestionar repositorios locales o repositorios
remotos pero sólo cuando el remoto sea GitHub. Hay muchas alternativas, pero
enseñar las *GUI* para Git no es el objetivo de este curso.

### Instalación en Linux
En Linux lo más sencillo es dejarle la tarea de instalación a nuestro gestor de
paquetes (aptitude/apt, pacman y portage por nombrar algunos) ya que con un
simple comando lo tendremos instalado. ¿El *problema*? Que cada distribución
utiliza su propio gestor de paquetes y el comando con el que se *interactúa* con
él no es estándar. Y digo *problema* porque asumo que si utilizáis Linux es
porque estáis familiarizado con el gestor de paquetes que corresponda. En todos
los gestores de paquetes el paquete para instalar Git, como no podría ser de
otra forma, se llama `git` y es fácil de encontrar, pero no obstante repasemos
las principales *distros*.

#### Debian
```shell
sudo apt install git
```

#### Ubuntu
```shell
sudo apt install git
```

Pero si queréis la última versión *no-estable* disponible podéis añadir un nuevo repositorio:

```shell
sudo add-apt-repository ppa:git-core/ppa
sudo apt update
sudo apt install git
```

#### openSUSE
```shell
sudo zypper install git
```

#### Arch Linux
```shell
sudo pacman -S git
```

#### Gentoo
```shell
sudo emerge --ask --verbose dev-vcs/git
```
Si la distribución (o sabor) que uséis no aparece aquí damos por hecho que
sabéis cómo compilar y trabajar con la consola y encontráis la forma de
instalarla.

### Instalación en macOS
Desde hace algunas versiones, en macOS se pueden instalar las herramientas para
desarrolladores de Apple, y entre ellas se encuentra Git, aunque una versión
algo desactualizada. Si queréis saber si la tenéis instalada ya sólo tenéis que
abrir la terminal y escribir:

```shell
git --version
```

Si tenéis instaladas las herramientas de desarrolladores os aparecerá la versión
de Git que hay instalada en vuestro equipo, si no, os dará *seguramente* la
posibilidad de instalar las herramientas para desarrolladores.

Otra opción es instalar [Homebrew](https://brew.sh/), un gestor de paquetes para
macOS desde el que poder instalar multitud de aplicaciones desde la propia
terminal, como si estuviésemos utilizando una distribución de Linux (que en el
fondo es lo que estamos haciendo, pero…) . Si queremos instalar Homebrew basta
con un sencillo comando en nuestra terminal:

```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Y una vez instalado Homebrew, para instalar Git:

```shell
brew install git
```

*Et voilà!*

### Instalación en Windows
Git está creado para ser ejecutado y disfrutado en entornos Unix, por lo que al
Windows no ser uno de ellos la instalación y su uso es un poco diferente
internamente, así que la instalación que hagamos en realidad instalará un
*emulador* de terminal Unix para poder hacer uso de Git. No obstante, en las
últimas versiones, durante la instalación podemos elegir (y viene por defecto
seleccionado) que el uso del comando git esté disponible desde la consola de
comandos del sistema (`cmd.exe`), así que aunque Git trabaja de forma diferente
internamente en Windows, el usuario no llega a apreciar la diferencia.

Vamos a ir a la página de [descargas de Git para
Windows](https://git-scm.com/download/win) e instalaremos la versión
correspondiente según las especificaciones de nuestro equipo. La instalación de
Git, como cualquier otro programa en Windows, sigue el mismo patrón de
*siguiente, siguiente, siguiente*, hasta encontrar el botón de *finalizar*. Si
todo salió correctamente desde la consola de comandos del sistema (`cmd.exe`)
deberíamos tener acceso a Git:

```shell
git --version
```

Si nos muestra la versión de Git instalada es que todo funcionó bien.

### Configuraciones iniciales
Estas configuraciones, y en realidad todo lo que viene a partir de ahora, es
común para Git sea cual sea el sistema operativo que tengas instalado, ya que la
única diferencia que existe entre ellos es cómo hacer la instalaicón.

Lo primero que debemos hacer en Git es configurar nuestro nombre de usuario y
nuestro correo electrónico, para que en cada *commit* (modificación en la *línea
temporal*) que hagamos quede constancia de quién la realizó, para ello
ejecutamos estos comandos, lógicamente reemplazando los datos de prueba por los
correctos:

```shell
git config --global user.name "Javi Palacios"
git config --global user.email javi@fjp.es
```

También podemos configurar el editor de texto que utilizará por defecto Git, por
ejemplo, cuando hagamos un *commit*:

```shell
git config --global core.editor vim
```

Podemos también comprobar si todas las configuraciones que tenemos son correctas
utilizando el siguiente comando:

```shell
git config --list
```

Y hasta aquí llegó la instalación y la configuración inicial de Git, recordad
permanecer atentos a próximas entregas de esta serie para aprender a utilizar en
profundidad este genial sistema de control de versiones. Por ahora, puedes
aprender a hacer [tu primer commit en
Git](/es/article/getting-started-with-git/). 🙂

Y recordad… ¡Nunca dejéis de programar!
