---
title: "¿Qué es Git?"
post_slug: "que-es-git"
date: "2017-10-27T20:11:08.000Z"
excerpt: "Git está en boca de todos: GitHub, GitLab, sistemas de control de
versiones, colaborar en proyectos de software libre… En este artículo
intentaremos aclarar todas las dudas que puedas tener al respecto."
categories:
  - "tutoriales"
i18n: ""
tutorial: "git"
course: "domina-git-desde-cero"
cover: "../../default.jpg"
---

[Git](https://git-scm.com/) es uno de tantos **sistemas de control de
versiones** que han ido aparenciendo a lo largo del tiempo para facilitarnos la
vida a los desarrolladores. Es el último en llegar, aunque su *juventud* no es
un lastre, más bien en este caso es un punto a su favor. Ha tenido la
oportunidad de conocer las carencias y defectos de sus antecesores (de
[Subversion](https://subversion.apache.org/) principalmente) y ha llegado justo
para hacer que las tareas que antes eran complejas ahora sean ridículamente
fáciles. Y por cierto, fue el otro gran proyecto de un tal [Linus
Torvalds](https://es.wikipedia.org/wiki/Linus_Torvalds), quizá hayáis oído
hablar de él. 😛

Git es un proyecto libre y gratuito, se puede encontrar el [código fuente de
Git](https://github.com/git/git) en GitHub para consultas o para aprender; en su
mayoría el lenguaje de programación utilizado es C, así que si os interesa ver
cómo escriben código la gente que más domina este lenguaje es una buena idea
echar un ojo al repositorio.

### ¿Qué es un sistema de control de versiones?
Hemos mencionado al principio **sistema de control de versiones** pero no demos
por supuesto que se saben cosas que quizá no, así que ¿qué es un sistema de
control de versiones? Pues para nosotros, como desarrolladores, principalmente
una forma de llevar un control de los cambios que hemos ido realizando y de
poder volver atrás fácilmente cuando algo que hayamos hecho no funcione como
esperábamos. Nada de estar recordando cómo estaba cierta parte del código cuando
todo funcionaba o de estar comentando porciones de código que después nunca se
eliminan y quedan ahí para el recuerdo en una especie de museo del horror con
código que nadie sabe qué hacía ni por qué está ahí.

Pero no es ésa la única de sus bondades: también nos permite trabajar en
paralelo (en Git gracias al uso de *ramas*) en distintas versiones de nuestra
aplicación, bien porque no sepamos cómo afrontar un cambio, y queramos probar
diferentes formas para ver por último cuál es más eficiente y desechar las demás
o porque estemos trabajando a la vez (una o más de una persona) en diferentes
partes del proyecto y que las modificaciones de unas porciones de código no
tengan por qué afectar ni interrumpir el resto de desarrollo… básicamente, poder
fusionar en muchos casos automáticamente esos cambios y que todo quede bajo
control.

### Qué hace que Git mole tanto
La principal diferencia de Git respecto a Subversion es que Git trabaja en
local. Subversion enviaba la información de cada cambio efectuado en el código a
un servidor, que es quien iba guardando la *línea del tiempo* de tus
modificaciones; Git ese proceso lo hace en local, cada vez que utilizas Git la
respuesta es inmediata porque no depende de una conexión a internet… está el
concepto de los **remotos** (para añadir servidores como
[GitHub](https://github.com/) o [GitLab](https://gitlab.com/)… pero también
alguno menos conocido como el servidor de un compañero de trabajo o el de
nuestra empresa) que veremos en profundidad más adelante, pero no son necesarios
en ningún caso, sólo nos aportan un *escaparate* de nuestro código y en algunos
casos, previa configuración, servicios extra como el de [Travis
CI](https://travis-ci.org/) en GitHub, que es capaz de ejecutar nuestra batería
de test cada vez que enviemos un cambio realizado para que sepamos si ese cambio
ha pasado los test o *ha roto algo*, una forma sencilla de automatizar los test
que todos tendríamos que tener en cada uno de los proyectos que hagamos.

La no dependencia de una conexión a internet es algo que se agradece
enormemente, sobre todo si en algún momento has utilizado un sistema de control
de versiones en el que prácticamente no puedes hacer nada si no tienes acceso al
servidor en el que se aloja toda tu información con los cambios guardados. Si
estamos trabajando en equipo, trabajar en cualquier lugar y simplemente requerir
una conexión de internet cuando queramos que todos los cambios realizados se
envíen a un servidor remoto para que los demás sepan qué hemos cambiado, o si
trabajamos en algún proyecto personal no requerir conexión a internet para nada…
¡oh, qué maravilla!

Esperamos que os hayáis quedado con ganas de saber más acerca de Git y que
estéis atentos a las próximas publicaciones, porque en sucesivas entregas de
esta serie [aprenderemos a instalar
Git](/como-installar-git-en-linux-macos-y-windows/), iremos
descubriendo a fondo los principales comandos de Git, cómo usar Git de forma
correcta, y si quieres ir un paso más allá para dominar Git también repasaremos
algunas de las convenciones más usadas para que nuestra experiencia con este
sistema de control de versiones sea todo un éxito.

¡Nunca dejéis de programar!
