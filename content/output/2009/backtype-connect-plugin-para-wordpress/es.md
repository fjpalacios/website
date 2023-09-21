---
title: "BackType Connect, plugin para WordPress"
post_slug: "backtype-connect-plugin-para-wordpress"
date: "2009-12-30T14:02:35.000Z"
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

[![](images/tutorial.png "tutorial")](http://fjp.es/wp-content/uploads/tutorial.png) Todo empezó con [un tweet de Bori](https://twitter.com/BlogdeBori/status/7174580024) en el que preguntaba cómo se podían twittear comentarios relacionados a un artículo como un comentario más en el blog. [Le comenté](https://twitter.com/wizard/status/7176541393) que cuando descubriera cuál hacía eso, que me avisara.

### Introducción

[Investigando por mi cuenta](https://twitter.com/wizard/status/7176914728) llegué hasta el plugin **Tweetbacks**, pero no me gustó; por la sencilla razón de que no funcionaba. Y tras seguir buscando, más, más y más... llegué hasta [BackType Connect](http://wordpress.org/extend/plugins/backtype-connect/): un plugin específico para **WordPress** que se encarga, además de **poner como un comentario normal más algo que se comente relacionado con alguno de tus artículos en Twitter**, también lo hace con otros servicios como **FriendFedd, Digg, Reddit, Hacker News o, simplemente, comentarios en cualquier blog que tenga RSS** (todos). Genial, ¿no? Al tajo pues.

### Instalación

Lo primero, obviamente, es descargar el plugin. Que bien se puede hacer desde [la página del autor](http://www.backtype.com/plugins/connect), bien [desde la página del plugin en WordPress](http://wordpress.org/extend/plugins/backtype-connect/) o bien desde el instalador de plugins automático que tenemos en nuestro **WordPress**. Lo activamos y nos dirigimos hacia su página de confiduración, dentro de la sección de **opciones**.

Arriba del todo, en azul, veremos un botón que pone **enable**; hay que darle para que, desde ese momento, todos los comentarios que detecte nos los vaya añadiendo como comentarios a nuestros respectivos artículos.

Tenemos varias opciones de configuración:

1. **Comments sort:** con las opciones **Mixed** o **Separate**; que nos vale simplemente para indicar si queremos que los comentarios estén, por orden de llegada (como siempre), junto con el resto de comentarios escritos en el blog o en una sección aparte. En mi caso, según gustos claro, elegí la opción **Mixed** (que viene por defecto) para que estén todos juntos.
2. **Comments summary:** podemos marcarla, o no, depende si queremos que nos muestre el comentario en nuestro blog o no; en mi caso, la dejé marcada.
3. **Link to more comments:** añade un botón al comentario para que podamos ver más comentarios (en Twitter, por ejemplo, daría el usuario del comentarista) de la persona que nos dejó el comentario.
4. **Ignore comments on my own blog:** esta, obviamente, la marcamos. Se entiende: ignora los comentarios que se hagan en el blog propio; que para eso ya están los **pingbacks**.
5. **Ignore retweets:** pues eso, a gusto de cada cual ignoramos, o no, los RT. En mi caso, los ignoro, porque como comentario para el blog no me sirve un RT que no aporte nada más que el tweet original.
6. **Before showing a comment... An administrator must always approve the comment:** Pues se entiende, pregunta si quieres que los comentarios de este tipo se queden en cola de moderación y que un administrador los apruebe antes. Cuestión de gustos, también.
7. **Use Akismet:** se marca, o no, si quieres que Akismet filtre ese tipo de comentarios en busca de comentarios de spam. Personalmente ésta la veo muy útil; en mi caso, marcada.

Tras eso, y en la misma página de configuración, podemos elegir qué medios están activados para importar comentarios: **Blog Comments**, **Twitter**, **FriendFeed**, **Digg**, **Reddit** y **Hacker News**. En mi caso, todos activados. En caso de que algo no me aportara siempre tenemos la opción de eliminarlo desde nuestra sección de comentarios en el panel de administración. Y esto es todo, amigos, tan fácil como esto.

### Un pequeño truco

Soy demasiado maniático con el idioma; si mi blog está en Español, quiero que todo esté en Español, no con cosas sueltas por ahí en inglés. Este plugin, visiblemente, utiliza varios textos en inglés que, si queremos, podemos traducir al español. Para ello necesitaremos irnos a la carpeta de **plugins** de nuestro **WordPress** y buscar la carpeta del plugin, que se llama **backtype-connect**. Utilizaremos dos archivos para modificarlos: **comment-template.php** y **backtype-connect.php**. Vamos allá.

Archivo **comment-template.php**:

1. Buscamos la penúltima línea del archivo:
    
    echo '
    
    Additional comments powered by [BackType](http://www.backtype.com/search?q=' . get_permalink($post->ID) . ')
    
    ';
    
    Y podemos traducirla nosotros como queramos; un ejemplo:
    
    echo '
    
    Comentarios adicionales gracias a [BackType](http://www.backtype.com/search?q=' . get_permalink($post->ID) . ')
    
    ';
    

Archivo **backtype-connect.php**:

1. Buscamos la línea:
    
    $desc = '
    
    _This comment was originally posted on [' . $source . '](' . $entry['comment_url'] . ' "' . $title . '")_
    
    ';
    
    Y la podemos reemplazar por esto:
    
    $desc = '
    
    _Este comentario fue originalmente publicado en [' . $source . '](' . $entry['comment_url'] . ' "' . $title . '")_
    
    ';
    
2. Ahora buscamos esta línea:
    
    return (($link == '') ? '' : $link . '   ') . '[More from author](' . $profile_url . ')';
    
    Y la reemplazamos por esta:
    
    return (($link == '') ? '' : $link . '   ') . '[Más del autor](' . $profile_url . ')';
    

Y con esto y un bizcocho... :) Espero que os haya servido de ayuda este tutorial.

\[ayuda\]
