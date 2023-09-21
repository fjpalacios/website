---
title: "Página personal"
post_slug: "pagina-personal"
date: "2007-05-24T00:29:33.000Z"
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

La idea de poner el weblog bajo el subsominio “blog” era la de poner en la raíz del dominio una [página personal](http://fjp.es) que hiciera como de _portada_ o _carta de presentación_ hacia lo que pueden encontrarse más adelante. No sabía bien cómo hacerla, y al final me he decantado por una página sencilla, minimalista, y no muy sobrecargada. Como suelen ser la mayoría de páginas.

De momento no es que está tremendamente cargada de cosas, pero al menos sí tiene la información más relevante sobre mi persona.

Mi máquina la tenía configurada, desde el principio, en la codificación **ISO-8859-1** (la codificación por defecto para españa). Al querer hacerla en **UTF-8** he tenido bastantes problemas; tantos, que de hecho ni lo he conseguido, ¡que cosas! Las locales en Linux no las toqué nunca demasiado, por lo que puedo decir que no se me dan demasiado bien. ésto junto con que hace tiempo que no entraba a la consola de Linux, y digamos que me deshabitué… todo se junta.

De momento la dejé así, si algún día consigo configurar mi máquina para UTF-8 cambiaría la configuración transparentemente para el visitante, pero con muchísimas ventajas respecto a como está ahora.

El weblog, si os fijáis, está en UTF-8, y los curiosos pensaréis que cómo ésto puede estar como quiero, y la página personal no… Es _sencillo_: a WordPress tú le especificas la codificación que quieres, y él convierte y guarda los textos de acuerdo a esa codificación, por tanto, al mostrarlo siempre funcionará correctamente. Una prueba la tenéis al enviar un comentario: cuando actúa el AJAX y aparece automáticamente el comentario, la codificación de ese comentario es errónea, pero si justo después recargas la página, todo se ve bien de nuevo. ésto se debe a que AJAX no manda una nueva consulta a la BDD (que si lo hiciera, sí lo recogería bien) sino que, digamos, _arrastra_ el texto de un sitio (el área de texto) a otro (la parte donde salen los comentarios).

Opinad sobre la página si gustáis. A ver qué os parece. ![:)](http://fjp.es/wp-includes/images/smilies/icon_smile.gif)
