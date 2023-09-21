---
title: "Añadir un miniblog a Wordpress"
post_slug: "anadir-un-miniblog-a-wordpress"
date: "2007-07-02T12:54:23.000Z"
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

![tutorial](images/tutorial.png "tutorial")En mi anterior andadura por la red publiqué un tutorial para poder insertar un miniblog (o asides) a nuestro Wordpress, ponerlo de nuevo aquí era una de las tareas pendientes que tenía, y así añadirlo a la sección de tutoriales. Hoy al ver el [post de Andrés](http://www.andresmilleiro.info/blog/cosas-pendientes-y-una-peticion) he visto que no había mejor momento para hacerlo. ![:)](http://fjp.es/wp-includes/images/smilies/icon_smile.gif)

Lo primero que hay que pensar es: ¿dónde quiero que me salgan las entradas que marque como _miniblog_? Hay dos opciones, **a)** podemos tenerlo puesto en un lateral, en una sidebar o en cualquier otro sitio que no tenga nada que ver con el espacio destinado a seguir la cronologí­a de entradas en el weblog; **b)** podemos ponerlo en el espacio destinado a las entradas del weblog, pero con un estilo diferente al resto de entradas, para que se diferencie lo que es una cosa de lo que es otra.

**¿Cuál prefieres?**

### Opción a

- Bajarnos el plugin [MiniPost](http://dev.wp-plugins.org/file/mini-posts/trunk/mini-posts.php).
- Lo subimos a nuestra carpeta de plugins (**wp-content/plugins/**).
- Vamos al panel de administración de nuestro weblog, a la sección **Plugins** y lo activamos.

- Abrimos el archivo donde lo queramos poner, por ejemplo, _sidebar.php_ y elegimos sitio. Ahí tenemos que poner algo como esto:
    
- Escribimos la entrada que queramos y justo debajo marcamos la casilla que dice _This is a mini post_

Así­ estarí­a todo realizado ya, al publicar aparecería la entrada en la sidebar, como estaba puesto en el ejemplo, y ya tendrí­amos nuestro weblog apunto para poder utilizarlo.

### Opción b

Para esta opción se necesita meter unas cuantas lí­neas PHP en nuestro archivo _index.php_, aquí­ no necesitamos ningún plugin ni nada similar.

- Creamos una categorí­a, llamémosla “asides”, “miniblog”, “miniweblog”… como queramos; una vez creada tenemos que fijarnos en el **ID** que se le ha asignado
- Abrimos nuestro archivo _index.php_ y buscamos la lí­nea que llama a la cabecera, algo como esto:
    
    O bien, como esto:
    
- Justo debajo añadimos esto:
    
    \\s\*
    
    |', '', $str);
    }
    ob\_start('stupid\_hack');
    ?>
    
    Esto Básicamente lo que hará es que si tenemos dos
    
    seguidos nos los _junte_.
    
    - Ahora tenemos que buscar una lí­nea como esta:
        
        Ojo, también puede estar así:
        
        De ser este el caso la reemplazamos por la de arriba.
        
    - Justo debajo de esa lí­nea añadimos esto:
        
        - post\_content); echo ' '; ?> [@](<?php the_permalink() ?> "Enlace permanente a <?php the_title(); ?>") 
        
        Donde pone **ID** (en la primera lí­nea) debemos sustituirlo por el número que apuntamos en el primer punto, que es el número de ID que se le asignó a la categoría que habíamos creado.
        
    - Ahora tenemos que buscar una lí­nea como esta:
        
        o bien una como esta:
        
        y reemplazarla por esta:
        
    - Ahora deberí­amos ver más abajo algo como esto:
        
        de no ser así­, que lo que vemos es algo como esto:
        
        lo reemplazamos por la de arriba.
        
    - Ahora nos vamos al panel de administración, escribimos una entrada y la metemos en la categorí­a que creamos; llámese “miniblog”, “asides”, “minipost” o “pepito”. Al darle a publicar ya tendremos la entrada de una manera diferente al resto.
    
    ### Opción a y b
    
    Ahora, en ambos casos, para que esté más acorde al diseño de nuestro weblog, podemos editar la hoja de estilos de nuestro weblog (generalmente **style.css**) creando un estilo _.asides_ para personalizar nuestro _miniblog_. Disminuir tamaño de las letras, ponerle un fondo, un borde…
    
    Cualquier duda/sugerencia para este _mini-tutorial_ podéis escribirlo en un comentario.
    
    Espero que sirva de algo y tenga utilidad. ![:)](http://fjp.es/wp-includes/images/smilies/icon_smile.gif)
    
    ### Nota final
    
    Los ejemplos que puse de texto en lo que tenéis que reemplazar son los dos casos más frecuentes que se suelen ver en los themes de Wordpress, pero como la programación es libre, y el tema de estructurar código también lo es, hay infinidad de formas de escribir un código, y que haga lo mismo que lo que yo puse. Si tu theme no tiene el código ni parecido a lo que puse yo, házmelo saber y te echaré un cable en todo lo que pueda. ![:)](http://fjp.es/wp-includes/images/smilies/icon_smile.gif)
    
    \[ayuda\]
