---
title: "Campo \"ubicación\" obligatorio al registrarse en phpBB"
post_slug: "phpbb-campo-de-ubicacion-obligatorio-al-registrarse"
date: "2009-10-07T13:18:42.000Z"
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

![tutorial](images/tutorial.png "tutorial")Supongo que si estás leyendo esto es porque, sea por lo que sea, quieres que los usuarios de tu foro cuando entren rellenen de forma obligatoria el campo de **ubicación**. Y es que a todos nos gusta saber de dónde son la gente que entra a nuestros foros phpBB, ¿a que sí? Y como verás, hay muchas páginas donde preguntan cómo hacerlo, pero en prácticamente ningún sitio acabas por saber _por dónde van los tiros_. Bueno, hasta ahora. has dado con el sitio idóneo. ![:D](http://fjp.es/wp-includes/images/smilies/icon_biggrin.gif) Al tajo.

### Planteamiento

Todo sería mucho más fácil si, por parte de phpBB, hubieran pensado que sería interesante que todos pudiésemos elegir qué campos iban a ir, o no, a la hora de que un nuevo usuario se registrara en nuestro foro. Los personalizados, sin problema, podemos hacer que aparezcan… pero el problema viene con los campos que vienen “de serie”. No hay forma, a través del panel de control, de hacer que éstos se muestren en la ventana de registro y que sean obligatorios (o no) a gusto del administrador. Como siempre, se puede recurrir a tocar el código fuente y, con este breve tutorial, es lo que vamos a aprender a hacer.

### ¿Qué necesitamos?

Para llevar a cabo la faena tenemos que disponer, o bien de un editor de textos que pueda conectarse a un servidor FTP (donde se supone que tenemos nuestro foro) para modificar archivos, o bien de un editor de textos normal y un cliente de FTP para poder bajarnos los archivos localmente (a nuestro ordenador), modificarlos, y enviárselos de nuevo a nuestro foro.

### Vamos allá pues

Lo primero que necesitamos es editar nuestro archivo **ucp\_register.php**, que lo encontraréis en vuestro directorio raíz del blog yéndoos a la carpeta **includes** y de ahí a la carpeta **ucp**. Vamos, lo que viene siendo la ruta **includes/ucp/ucp\_register.php**. Depende de la versión de phpBB que tengamos, las búsquedas que vamos a realizar pueden estar literalmente, o similares. Si no se encuentra literalmente, se puede buscar una única línea y ver que alrededor más o menos hay lo mismo. Aunque no sea exacto cien por cien, funcionará igual. No tiene pérdida.

1. Dentro del citado archivo, buscamos esta porción de código:
    
    $data = array(
    'username'         => utf8\_normalize\_nfc(request\_var('username', '', true)),
    'new\_password'      => request\_var('new\_password', '', true),
    
    y **justo debajo** añadimos esto:
    
    'location'         => request\_var('location', '', true),
    
2. Ahora, dentro del mismo archivo, buscamos esto:
    
    'email'            => array(
    array('string', false, 6, 60),
    array('email')),
    'email\_confirm'      => array('string', false, 6, 60),
    
    y tras eso añadimos esto:
    
    'location'         => array('string', false, 5, 60),
    
3. Buscamos este código:
    
    $user\_row = array(
    'username'            => $data\['username'\],
    'user\_password'         => phpbb\_hash($data\['new\_password'\]),
    'user\_email'         => $data\['email'\],
    
    y posteriormente añadimos esto:
    
    'user\_from'            => $data\['location'\],
    
4. Por último buscamos esto:
    
    $template->assign\_vars(array(
    'ERROR'            => (sizeof($error)) ? implode('', $error) : '',
    'USERNAME'         => $data\['username'\],
    'PASSWORD'         => $data\['new\_password'\],
    'PASSWORD\_CONFIRM'   => $data\['password\_confirm'\],
    
    y tras ese código añadimos esto:
    
    'LOCATION'         => $data\['location'\],
    

Ahora, para que nuestros usuarios lo rellenen cuando se registren, tenemos que ponerlo en la plantilla de registro, para ello dependiendo de la plantilla que tengamos activada el archivo estará en una carpeta u otra. La ruta directa sería así: **styles/PLANTILLA/template/ucp\_register.html**, donde pone PLANTILLA tendremos que sustituirlo por el nombre de nuestra plantilla activa. Por ejemplo, en mi caso, uso la plantilla **prosilver**, así que mi ruta sería: **styles/prosilver/template/ucp\_register.html**. Vamos allá.

1. Dentro del archivo **ucp\_register.html** buscamos esta porción de código:
    
    {L\_CONFIRM\_PASSWORD}:
    
    y justo tras eso añadimos esto:
    
    {L\_LOCATION}:
    

### Nota final

Y con esto está todo. Ahora supongo que los más impacientes habréis ido corriendo a probarlo, pero habréis visto que no os funciona, ¿es así? xD Bueno, pues sólo falta un pequeño detalle. En phpBB3 hay un sistema de _cache_ que almacena todas las plantillas para que no haya que cargarlas vez tras vez ofreciendo una mayor velocidad a la hora de conectar al foro. En la pantalla GENERAL del Panel de Administración veréis que hay una opción que se llama **Limpiar el cache**, y justo debajo un botón que pone **Ejecutar**; click et voilà!

\[ayuda\]
