---
title: "Cambia el enlace de «Visitar sitio» en la barra de administración de WordPress"
post_slug: "cambia-el-enlace-de-visitar-sitio-en-la-barra-de-administracion-de-wordpress"
date: "2015-09-10T12:46:41.000Z"
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

![](images/tutorial.png "tutorial")Recientemente hice un cambio drástico en este blog: antes WordPress estaba instalado para el blog y mediante redirecciones conseguía seleccionar algunas páginas para que fueran parte de mi página personal y no del blog… un lío. Ahora WordPress está en mi página personal directamente, como siempre debería haber sido, y el blog es parte de ella; sirviéndome de la opción de mostrar como página principal una página diferente al blog y el blog en otra sección diferente que no sea la página que carga nada más entrar. Hasta ahí todo bien.

El problema viene cuando para WordPress mi blog es [fjp.es](http://fjp.es) y no [fjp.es/blog](http://fjp.es/blog) como en realidad es. En la barra de administración de WordPress, entre otros accesos directos útiles, tenemos uno que uso especialmente: **Visitar sitio**. Este enlace aparece cuando estás en la zona del panel de administración y quieres acceder al blog en sí. Ya os imaginaréis: WordPress no me envía al blog sino a la página estática que fijé como página de inicio —web personal en mi caso.

### Cambiando el enlace del acceso directo «Visitar sitio»

Simplemente podríamos cambiar ese enlace modificando el archivo del código fuente, pero convendremos en que eso es una chapuza; además, siempre sería un cambio temporal: cada vez que haya una nueva actualización de WordPress perderíamos ese cambio.

Para evitar esto, como casi siempre, nuestra solución es tocar nuestro querido archivo **functions.php**, en el cual añadiremos lo siguiente:

function cambia\_enlace\_sitio\_adminbar($wp\_admin\_bar) {
    $node = $wp\_admin\_bar->get\_node('view-site');
    $node->href = home\_url('/blog');
    $wp\_admin\_bar->add\_node($node);
}
add\_action('admin\_bar\_menu', 'cambia\_enlace\_sitio\_adminbar', 100);

En mi caso lo único que necesito es que me lleve a la sección de **/blog**, por lo que me sirve con lo que puse en el ejemplo, y que obviamente debe ser cambiado si la sección a la que queremos acceder se llama de diferente forma:

    $node->href = home\_url('/blog');

En caso de que el enlace por el que se quiera cambiar sea otro completamente distinto al de la ubicación donde esté instalado WordPress se puede especificar la dirección web completa usando en su lugar esto otro:

    $node->href = 'http://fjp.es/blog';

### Cambiando el enlace del acceso directo en el nombre del blog

La barra de administración de WordPress, además de llevar un enlace a nuestra página en **Visitar sitio**, también lleva otro en el nombre de nuestro blog, que también se puede cambiar si se quiere. El código para ello sería este:

function cambia\_enlace\_sitio\_adminbar($wp\_admin\_bar) {
    $node = $wp\_admin\_bar->get\_node('site-name');
    $node->href = is\_admin() ? home\_url('/blog') : admin\_url();
    $wp\_admin\_bar->add\_node($node);
    $node2 = $wp\_admin\_bar->get\_node('view-site');
    $node2->href = home\_url('/blog');
    $wp\_admin\_bar->add\_node($node2);
}
add\_action('admin\_bar\_menu', 'cambia\_enlace\_sitio\_adminbar', 100);

Al igual que en el caso anterior, hay que cambiar **/blog** por el nombre de la sección que corresponda; u optar por la dirección completa si el enlace deseado es diferente al directorio raíz de WordPress. Un apunte: este código modifica ambos enlaces, por lo que hay que cambiar **/blog** por el enlace deseado en dos líneas diferentes: las número 3 y 6.

Cualquier duda que pueda surgir durante el proceso dejádmela en la sección de comentarios y trataré de solucionarla.

\[ayuda\]
