---
title: "Publicar estadí­sticas AWStats de cPanel"
post_slug: "publicar-estadisticas-awstats-de-cpanel"
date: "2007-06-06T12:43:51.000Z"
excerpt: ""
categories: "tutoriales"
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
cover: "../../default.jpg"
---

![tutorial](images/tutorial.png "tutorial")Muchos de nosotros, en nuestro hosting, tenemos un apartado donde podemos visualizar las estadísticas de visitas que recibe nuestra página. Como muchos habréis podido ver, para entrar en la página de las estadísticas debemos meternos dentro de cPanel, con lo cual, no spide un usuario y una contraseña, y de poco nos sirve poner un enlace a nuestros lectores hacia las estadísticas, si al final no van a poder verlas por no poseer dicho usuario y contraseña.

Pues bien, aunque es un remedio algo viejo ya, no recuerdo de dónde lo saqué, pero quiero compartirlo con vosotros. Es fácil, el tema es hacer una identificación mediante PHP, de forma totalmente invisible para el usuario, y hacer que se muestre la página de las estadísticas como si nos hubiéramos identificado en cPanel.

Para hacerlo, os pongo los pasos que deberéis seguir para que todo salga bien:

- Primero tenéis que entrar por FTP a vuestro servidor y crear, donde queráis una carpeta para las estadísticas. Puede ser, por ejemplo “**awstats**“, o en un alarde de imaginación repentina, bastaría también nombrando a la carpeta “**estadisticas**“

- Ahora tenéis que entrar al PHPS donde tengo el [código PHP que necesitáis](http://fjp.es/wp-content/uploads/awstats.phps) para hacerlo funcionar y poneros a editar un poco el código… arriba del todo os piden unos datos para poder identificarse en vuestro cPanel

- **$user**: pondremos el nombre de usuario que tenemos en nuestro cPanel…
- **$pass**: … y la contraseña del mismo.
- **$domain**: aquí tendremos que poner el dominio del que queremos las estadísticas, algo como **blog.pepito.com**, por ejemplo. Sin _http://_, ni _www._, ni nada de nada.

- Una vez editado, lo guardamos como **index.php** y lo subimos al servidor, a la misma carpeta que creamos previamente.
- ¿Esperabas algún paso más? Pues ya está todo. Ahora sólo nos queda entrar en la dirección donde tenemos las estadísticas, por ejemplo: **blog.pepito.com/estadisticas/** y podremos ver las estadísticas sin mayores problemas.

A mí, desde luego, me ha resultado muy útil. ¡A disfrutarlo!

\[ayuda\]
