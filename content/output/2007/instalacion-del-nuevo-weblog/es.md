---
title: "Instalación del nuevo weblog"
post_slug: "instalacion-del-nuevo-weblog"
date: "2007-05-23T11:37:26.000Z"
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

Como ya dije ayer, contaría hoy cómo fueron las cosas desde que pensé en instalar ésto, hasta que (hoy de madrugada) terminé. La verdad es que todo no fue lo fácil que yo pensaba, pero con un poco de tiempo y paciencia al final lo logré.

Lo primero fue instalar la última versión, ya actualizada, de WordPress. Pese a que sabía que era muy nueva y habían fallos, pensé que era lo mejor. Al tenerla instalada, los primeros problemas vinieron cuando no iban bien los widgets, y pese a que no los uso en exceso, sí los utilizo para poner las caratulas de [Last.fm](http://www.lastfm.es) que hay en la parte inferior de este weblog. Buscando por Google, **como siempre**, al final di con [la solución](http://www.neverlandteam.net/blog/2007/05/16/error-en-wordpress-22-problemas-con-los-widgets/) para que funcionaran correctamente los widgets. ![:)](http://fjp.es/wp-includes/images/smilies/icon_smile.gif)

Después de eso, básicamente todo está fácil respecto al weblog. Algún que otro problemilla con el _.htaccess_, pero reconozco que fue por no estar atento y no fijarme, así que no se puede tener en cuenta.

Los problemas me lo dieron, más que nada, las estadísticas de [AWStats](http://awstats.sourceforge.net/). La configuración es más o menos sencilla, pero teniendo en cuenta que he de hacerlo desde 0 (porque en mi máquina no las tenía instadas) pues lleva algo más de tiempo, pero vamos no mucha cosa. Donde más problemas tuve, **y ésto es por la falta de práctica**, fue al programarle la tarea al [cron](http://es.wikipedia.org/wiki/Cron_%28unix%29) para que se actualizaran automáticamente en el tiempo que yo quisiera. No daba con la línea, probé un montón de variaciones, y nada, y al final tuve que buscar la línea por Google… La verdad es que me deprimió ésto un poco, porque hace tiempo (cuando estaba con Linux todo el día, y a pleno rendimiento) el cron no tenía mayores dificultades para mí… pero vamos, como siempre, todo se olvida…

Ahora mismo está todo funcionando, y pese a que esta mañana han habido unos problemas en la carga de la página por culpa de [Twitter](http://www.twitter.com) (que no funcionaba bien), ya está resuelto: quité la opción de mostrar mi última actividad en la barra lateral y ya no hay problema. No sé si la pondré de nuevo, porque creo que ralentiza mucho la carga de la página, pero en caso de que lo haga, hasta que no vaya del todo bien no la volveréis a ver. Además, con lo desactualizada que tengo la cuenta, qué más da. ![:D](http://fjp.es/wp-includes/images/smilies/icon_biggrin.gif)

Aunque sé que hay muchos, llevo en mente hacer un tutorial sobre **cómo instalar MySQL + phpMyAdmin** en Debian para poder montar un weblog, o lo que se te ocurra, y otro sobre cómo poder **hacer funcionar perfectamente AWStats**, que es lo que más me ha costado a mí, y lo que más me interesa… el anterior, con tiempo. ![:)](http://fjp.es/wp-includes/images/smilies/icon_smile.gif)

Poco más por ahora, ¡saludos!
