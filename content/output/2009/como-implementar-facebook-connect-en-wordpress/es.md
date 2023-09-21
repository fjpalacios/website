---
title: "Cómo implementar Facebook Connect en WordPress"
post_slug: "como-implementar-facebook-connect-en-wordpress"
date: "2009-04-22T12:50:49.000Z"
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

![tutorial](images/tutorial.png "tutorial")Lo primero y principal, obviamente, es tener una cuenta en [Facebook](http://www.facebook.com). Si no mal lo tenemos. xD A saber que realmente esto no es la panacea, si no una función que puedes implementar en tu blog para crear una especie de red social listando la gente que te lee. Pero realmente no es así, porque muchos de los que te leen quizá pasen de vincular su cuenta Facebook (por un motivo u otro) así que lo que tendrás ahí serán los lectores con los que mejor te llevas muy probablemente.

A mí me costó horrores hacerlo, pero es bien fácil. Realmente pasó que se me olvidó meter la dirección de mi blog donde debía meterla para que funcionara correctamente, y no hacía mas que decir que la aplicación no estaba correcta y no funcionaba. Me desesperé. xD

### Obtención del plugin necesario

Esto se puede hacer a mano. De hecho, se facilita el código para poder hacerlo. Pero pienso que si lo tenemos en forma de plugin para WordPress es una tontería complicarnos la vida implementando un código que a golpe de un click ya tendremos implementado. El plugin en cuestión se llama [Facebook Connect](http://www.sociable.es/facebook-connect/) (en un alarde de originalidad, vaya), así que lo descargamos, que seguro que nos hace falta después.

### Instalación

- Lo primer debemos subir la carpeta que hemos descargado con el plugin a la carpeta **plugins** que encontraremos dentro de **wp-content** en la raíz de nuestro WordPress.
- Ahora debemos entrar en la sección de [Desarrolladores](http://www.facebook.com/developers/) de Facebook, donde daremos autorización a la aplicación **Developers** para que podamos utilizarla.

- Nos dirigimos a la zona donde podremos [crear nuestra aplicación](http://www.facebook.com/developers/createapp.php) propia, le damos un título, marcamos que estamos de acuerdo y le damos a guardar cambios. Ahora nos aparecerá una ventana que dejaremos abierta porque pasos más adelante la necesitaremos.
- Debemos acudir a la **sección de plugins** de nuestro **Panel de Administración** y activar el plugin **Facebook Connector**.
- Nos vamos a la configuración del plugin en cuestión, que lo encontraremos en la sección de **Opciones** de nuestro **Panel de Administración** y allí se nos piden unos datos: **clave API** y **número secreto**. Las encontraremos en la página de nuestra aplicación en Facebook que anteriormente dejamos abierta.

- El resto de opciones del plugin son personalizables por cada cual. Es indiferente en cuanto a configuración. Podemos elegir qué texto se mostrará en Facebook cuando alguien comente en nuestro blog y algunas cosas más. Cuando todo esté como queremos le damos a **guardar configuración** y el plugin automáticamente teniendo en cuenta los datos que le facilitamos configurará parte de nuestra aplicación.
- Desde la ventana que dejamos abierta (recargamos por aquello de que el plugin ha hecho cosas por sí solo, y si no nos cargaremos sus cambios) podemos configurar nuestra aplicación. Desde el **apartado básico** podemos añadirle un logo, la descripción, nuestro correo, etc; podemos configurar todos los apartados si nos apetece (yo no lo hice), pero lo más importante es dirigirnos al **apartado Connect** y donde pone **Connect URL** escribir la dirección de nuestro blog (es lo que dije al principio que se me olvidó).
- Ya solamente queda acudir a la sección de widgets de nuestra plantilla y añadir el widget del plugin donde queramos que se visualice. Si nuestra plantilla no tiene soporte para widgets (raro a estas alturas) podemos cargarlo manualmente mediante este comando: \[code lang="php"\]\[/code\]

### Nota final

Si todo ha salido bien no deberían haber ya más problemas. Todo debería funcionar correctamente y visualizarlo como ahora mismo se puede visualizar en este blog. Quizá con lo que más problemas puedas tener sea con el CSS a la hora de integrar el widget a tu plantilla, pero eso ya es teme aparte. A mí también me dio algo de dolor de cabeza. Si necesitas ayuda, ya sabes. Aunque no prometo mucho en cuanto a CSS se refiere ya que a mí, aunque acabe consiguiéndolo, también me cuesta.

\[ayuda\]
