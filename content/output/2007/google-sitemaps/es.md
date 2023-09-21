---
title: "Google Sitemaps"
post_slug: "google-sitemaps"
date: "2007-05-24T21:12:38.000Z"
excerpt: ""
categories: "tutoriales"
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

![tutorial](images/tutorial.png "tutorial")En mi anterior andadura hice un breve tutorial para poder instalar el fantástico plugin para WordPress llamado **Google Sitemaps Generator**. Con el cambio del weblog ésto se ha perdido, y como es algo bastante útil no podía dejarlo pasar, y lo pongo de nuevo aquí para que todo el mundo pueda seguirlo como guste.

Para los que no sepáis de qué se trata, es un plugin que lo que hace es tener _escaneada_ siempre tu página para, cuando programes o cuando envíes una nueva noticia, dé un aviso a Google para que pueda tener siempre actualizada tu página en sus servidores. Como ya dije, el plugin se llama [Google sitemaps generator](http://www.arnebrachhold.de/2005/06/05/google-sitemaps-generator-v2-final), y él solito se encarga de modificar el archivo **sitemap.xml** y **sitemap.xml.gz** (los que utiliza Google para saber el contenido de la página) y de hacer ping a Google (o lo que sería lo mismo: darle un aviso), así nosotros prácticamente nos olvidamos de que tenemos eso ahí.

La instalación es bastante simple, en el _readme.txt_ viene bastante bien explicada, pero no obstante voy a hacer una especie de _mini-tutorial_ para aquella gente que pueda necesitar ayuda a la hora de instalarlo.

- Creamos en el directorio raíz de WordPress (donde está la carpeta _wp-admin_, _wp-content_ y demás) los archivos **sitemap.xml** y **sitemap.xml.gz** dándoles permiso de escritura (para que WordPress pueda modificarlos cada vez que sea necesario actualizarlos)

- Nos vamos a **wp-content/plugins** y subimos ahí el plugin, como habitualmente haríamos.
- Vamos al panel de administración, de ahí a _plugins_ y lo activamos.
- Nos desplazamos al menú de opciones y ahí encontraremos una nueva pestañita llamada _Sitemap_, hacemos click en ella y le damos al botón que pone **Reconstruir Sitemap**. Ahora, si todo ha ido como debe, nos habrá rellenado los archivos _sitemap.xml_ y _sitemap.xml.gz_, que anteriormente estaban vacíos.

- Una vez creado tenemos que dirigirnos a [Google sitemaps](https://www.google.com/webmasters/sitemaps/) y desde allí dar de alta nuestro sitemap. Tenemos que elegir la opción de añadir uno nuevo e introducir la dirección donde se encuentra nuestro _sitemap.xml_, que será algo tipo _http://tuweblog.com/**sitemap.xml**/_.
- Nos dirá que introduzcamos un archivo en el directorio raíz de WordPress (donde antes creamos los dos ficheros), esto tiene que estar vacío, sólo es crearlo como anteriormente ya hicimos, el robot de Google que escanea nuestra página sólo necesita el número que tiene como nombre el archivo, para saber quienes somos. Es nuestro número de identificación en Google sitemaps.
- Una vez introducido, hacemos click en comprobar de nuevo, y si todo ha ido bien nos dirá que nuestro sitemap ha sido añadido satisfactoriamente

El plugin en cuestión se encargará él sólo de actualizarlo cuando sea necesario (se puede configurar desde las opciones de WordPress) y de hacer un ping a Google avisándole de que nuestro sitemap ha sido actualizado. En un periodo de tiempo, no demasiado prolongado, el bot de rastreo de páginas de Google se _dejará caer_ por nuestro weblog y actualizará el sitemap existente.

Como podréis ver es facilísimo de poner en funcionamiento, y es una herramienta muy útil para que nuestras búsquedas se posicionen mejor. Incluso nuestro _pagerank_ podría verse aumentado considerablemente.

Espero que haya sido de utilidad este breve tutorial y que todos los que tengáis un weblog y WordPress como CMS para gestionarlo os lo instaléis. Lo recomiendo encarecidamente.

\[ayuda\]
