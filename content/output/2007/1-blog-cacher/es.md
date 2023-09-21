---
title: "1 blog cacher"
post_slug: "1-blog-cacher"
date: "2007-11-06T14:59:21.000Z"
excerpt: ""
categories: "personal"
tags: ""
i18n: ""
synopsis: ""
score: ""
pages: ""
isbn: ""
asin: ""
author: ""
paper: "https://www.amazon.es/dp/undefined/"
ebook: "https://www.amazon.es/dp/undefined/"
publisher: ""
book_card: ""
genres_fic: ""
genres_nofic: ""
serie: ""
challenges: ""
---

Hace unos días hablando con mi amigo [membrive](http://membrive.es/) por IM me comentaba que le había puesto el WP-Cache a su blog, y que mejoraba considerablemente la carga del mismo. Yo hasta ahora nunca lo había usado, pero ahora que he vuelto, y quiero tenerlo todo bien, pues creo que ha llegado el momento.

No sé si será cosa mía o qué, pero tras la actualización a la última versión de WordPress parece como si el weblog fuera algo más lento. Aunque quizá pueda ser debido a otra cosa (la cual desconocería) y haya sido una mera coincidencia, pero ha sido así. Quizá este es otro de los motivos que me ha llevado a instalar un plugin de “caché” para el blog.

Hace un poco me puse a ello, y recordé que ayer mismo leí en el lector de feeds [una entrada de Andrés Nieto](http://www.anieto2k.com/2007/11/05/wp-supercache-otro-sistema-de-cache-para-wordpress/) en la que listaba unos cuantos plugins de estos, que son los que están interesándome a mí ahora. Tras leerla, veo que anuncia un ¿nuevo? plugin, pero dice que él usaba un tal [1BlogCacher](http://es.1blogcacher.com/). Como no tengo ni idea del tema, y normalmente si algo está usándolo Andrés es porque es bueno, me puse y lo instalé. Tiene una instalación muy sencilla (ver LEEME en el propio ZIP).

Ahora mismo estoy tirando de él, y no va nada mal, la verdad. El tiempo de carga estaba rondando los 30 segundos, incluso a veces lo superaba. Ahora he probado unas cuantas veces con él, y 6 segundos ha sido la máxima (al principio de instalarlo) dejándolo estable en unos 2 ó 3 segundos después de varios intentos (después de tener la página bien “cacheada”). Creo que es interesante cuanto menos.

Sólo hay una cosa que echo en falta, y es que arriba del todo de la página tengo una zona para unas cuantas frases aleatorias, y que antes cada vez que se recargaba la página se recargaba la frase también y salía una distinta cada vez. Ahora como la página realmente no se recarga cada vez, pues sale la misma, ¿qué haríais vosotros con esto?, ¿quitarlo?, ¿dejar que se recargue una vez cada hora, o cada vez que escriba una nueva entrada? de esta manera no se recarga tan rápidamente, pero cada cierto tiempo sí sale una frase nueva. No obstante, tampoco sé si hay forma de hacer que determinada parte de una página (esa) se recargue siempre que se recargue la página. ¿Sabéis vosotros algo?

Bien, espero vuestras opiniones acerca de la nueva velocidad de la página, y de todo lo demás que puse. ![:D](http://fjp.es/wp-includes/images/smilies/icon_biggrin.gif)

**Actualización:** según el comentario de [aNieto2k](http://www.anieto2k.com/) hay una forma de hacer que una función, o archivo completo, no sea cacheado y con ello conseguir lo que quería: que se recargue cada vez que se recargue la página. Tras probar una y otra vez con negativo resultado opté por ponerme en contacto con los creadores del plugin; muy amablemente (y rápidamente también) me respondió [Javier García](http://1blogr.com) explicándome que no funcionaba porque en el momento en que 1BlogCacher entra en acción, los plugins de WordPress todavía no están cargados, así que la solución es sacar la función del plugin y meterla en un archivo diferente al que se pueda tener acceso en todo momento (sin la previa comprobación que realizará WordPress para saber si el plugin está cargado). ¡Muchas gracias Javier! :D
