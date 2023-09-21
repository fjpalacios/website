---
title: "Abrir enlaces de phpBB en una nueva ventana"
post_slug: "phpbb-abrir-enlaces-en-ventana-externa"
date: "2011-02-13T17:10:24.000Z"
excerpt: ""
categories: "tutoriales"
tags: "phpbb"
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

![tutorial](images/tutorial.png "tutorial") Hoy me ha surgido la necesidad de hacer que en un foro phpBB3 **todos los mensajes que contuvieran enlaces que pudieran desviar la atención al foro en sí, se abrieran en una ventana externa**. Esto, **depende como tengamos el navegador configurado**, actuará de una forma u otra. Por ejemplo, se le puede indicar al navegador, que los mensajes que por defecto debieran abrirse en una ventana nueva, que se abran en una pestaña nueva. A gusto de cada cual, pero **el caso es que no hará que nuestros visitantes pierdan de vista nuestro foro**. Bien sea dejándolo en una pestaña, o en una ventana que siempre estará en la parte inferior una vez cierren la que se superpone, con el enlace al cual hicieron click. Para quien le interese, es bien fácil de conseguirlo.

Simplemente hay que acudir a la raíz de nuestro foro, buscar el archivo **viewtopic.php**, abrirlo, y localizar estas dos líneas:

$message = bbcode\_nl2br($message);
$message = smiley\_text($message);

Y justo debajo de ellas, añadimos esta otra:

$message = preg\_replace('/(class="postlink")/','class="postlink" onclick="window.open(this.href);return false;"',$message);

Tan fácil como eso, no tiene mayor misterio. Por las dudas, ésto sirve tanto para mensajes que contengan enlaces **que ya existan en el foro**, como para los mensajes que se creen **después** de esta modificación. **No hay que hacer absolutamente nada más**.

Dudas, sobornos, donaciones anónimas... **en los comentarios**. ;)

\[ayuda\]
