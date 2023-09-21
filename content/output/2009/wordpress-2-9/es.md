---
title: "WordPress 2.9"
post_slug: "wordpress-2-9"
date: "2009-12-21T18:59:56.000Z"
excerpt: ""
categories: "internet"
tags: "wordpress"
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
cover: "../../default.jpg"
---

[![](images/wordpress.png "wordpress")](http://fjp.es/wp-content/uploads/wordpress.png)

Como algunos sabréis por [mis](http://twitter.com/wizard/status/6837412157) [mensajes](http://twitter.com/wizard/status/6841866351) [maldiciendo](http://twitter.com/wizard/status/6842354182) [y](http://twitter.com/wizard/status/6845560246) [acordándome](http://twitter.com/wizard/status/6868632097) de todo vía [Twitter](http://twitter.com/wizard)... me cargué la BDD del blog. Y lo que más me jode no es eso, lo que más me jode es que fue por mi culpa, por zoquete. Os explico.

Cuando salió la actualización en el escritorio para actualizar a **WordPress 2.9**, sin pensármelo, actualicé. Y eso que nunca suelo hacerlo tan rápido, porque prefiero que sean otros los que investiguen los bugs por mí, y después activarlo yo. O ya no eso, si no probarlo, pero antes en local que en el blog, para no estropear nada. Bueno, el caso es que, pese a todo, actualicé. Sin pensármelo dos veces, como dije. La actualización funcionó de maravilla. La pena es que no estaba en Español, aunque tampoco importaba demasiado porque la traducción de **WordPress 2.8.6** funcionaba bastante bien, excepto pequeñas cosas que se veían en inglés, pero no importaba. Y hasta aquí, todo de maravilla.

El problema viene cuando, por la tarde, veo de nuevo un aviso en el escritorio que me indica que ya está disponible [WordPress 2.9 en Español](http://es.wordpress.org). Y claro, como estaba esperando los archivos de idioma de la nueva versión, actualicé de nuevo. Total, que actualizo, y como a muchos les pasó, tras la actualización la página se quedó en blanco. Todo en blanco, no se veía nada. Como aún era muy reciente, no había información por ningún lado. ¿Qué pensé? que por lo que sea, que no sé qué, al hacer la instalación automática se había jodido algo de la BDD SQL. Y, ni corto ni perezoso, entro a phpMyAdmin, me cepillo toda la BDD y tiro de una que tenía guardada de copia de seguridad de la noche anterior. Como no había escrito nada ni había recibido comentario alguno, no iba a perderse nada, genial... ¿no? Pues no.

Desde que uso cPanel sin posibilidad de entrar a mi hosting mediante acceso SSH (¡qué putada!) siempre realicé copias de seguridad completas, desde la utilidad de respaldo de cPanel. Mediante un servidor FTP que tengo en mi máquina, van descargándose todos los días copias de seguridad y, siempre, tengo la más reciente en mi poder. El caso es que, no sé si es mala suerte mía, o qué carajo, aunque ese método de copia de seguridad también hace un _backup_ de las bases de datos, repito que no sé por qué, se cepilla la codificación **UTF8** de la BDD y lo pone bajo una codificación que ni conozco ni domino (no, no es **latin1**, **ISO-8859-1(5)**, ni ninguna otra conocida. Así que las copias de seguridad que he ido realizando desde hace tiempo me valen para, literalmente, imprimirlas y limpiarme el culo con ellas.

Ahora, haciendo pruebas en local, ya sé y tengo controlado, que mediante la función de **Exportar** de phpMyAdmin se guardan perfectamente bien y sin ningún problema. Algo que me alivia, porque desde ahora siempre haré esas copias de seguridad además de las ya mencionadas a través de cPanel.

¿Os hacéis una idea de lo que es, a mano, editar todo el contenido del blog corrigiendo, página por página, comentario por comentario, entrada por entrada... TODO? Odio las tildes, las ñ, el símbolo del €, los dos puntos (:), las interrogaciones y las exclamaciones iniciales... LO ODIO TODO. :D

En fin, que no busquéis, pero que si veis algún error de codificación que se me haya pasado por algún lado, por favor, avisadme... que después de la paliza que me pegué, sólo falta que se me haya escapado algo. Gracias.
