---
title: "Ocultar particiones de OSX del escritorio"
post_slug: "ocultar-particiones-de-osx-del-escritorio"
date: "2010-02-08T15:33:25.000Z"
excerpt: ""
categories: "tutoriales"
tags: 
  - "apple"
  - "osx"
  - "snow-leopard"
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

![](images/tutorial.png "tutorial")Quizá para los que, como yo, antes de dar el salto a OSX proveníamos de Linux no es tan difícil dar con la solución a este _problema_, pero lo más seguro es que quienes provengan del mundo Windows no tengan ni idea de cómo conseguir esto.

### El problema

Me refiero, a **la molesta de tener en nuestro escritorio una partición de uno de nuestros discos duros que jamás vamos a utilizar**. Bien sea, porque se trate de una partición de otro Sistema Operativo, bien sea porque no sea nuestra... o por lo que Dios quiera que sea. El caso, es que queremos ver todas nuestras unidades de disco montadas, pero no queremos que cada vez que arranquemos nuestro sistema ESA partición concretamente se monte.

### La solución

Es cierto que **de forma más o menos fácil no se puede conseguir**, porque si seleccionamos la opción de que aparezcan en nuestro escritorio todas las particiones que tenemos montadas, se verán todas sin posibilidad de excepción. Así que lo que **debemos indicarle a nuestro Sistema Operativo es que x partición no se monte nunca automáticamente** hasta que no lo indiquemos nosotros.

Depende del tipo de formato que tenga nuestra unidad de disco, habrá que proceder de una forma u otra. Y más abajo veremos cómo proceder con cada una de ellas. Las particiones, recordemos que **lo más frecuente es que en nuestro OSX tengamos particiones del tipo HFS** (Mac OS Plus) pero también podemos tener particiones de Windows, que serían NTFS o las _universales_, FAT.

### Escribiendo algunos comandos en el Terminal

Para obtener el resultado que queremos **debemos manipular el archivo fstab** que se encuentra (tanto en Linux como en OSX) en **/etc/fstab**. Lo primero, es ver a qué disco duro queremos aplicar los cambios. Y para ello, escribimos en Terminal lo siguiente:

**diskutil list**

Nos aparecerá una lista de todos los discos montados y deberemos fijarnos en el que queremos (es obvio, pero lo indico por si acaso). Debemos fijarnos en el último apartado, donde veremos algo del tipo diskXsY, donde X e Y son números respectivos al disco duro donde se encuentra y qué partición es. En mi caso fue disk1s2 que indica que es el HD número 1 en su partición número 2. Así pues, nos quedamos con ese valor: disk1s2 (en mi caso, en el vuestro el que sea). Ahora, debemos teclear este comando:

**diskutil info disk1s2**

**Reemplazando**, obviamente, **el identificador de mi disco duro por el que sea en tu caso**. Con los datos que obtengamos de ese comando **deberemos fijarnos, si estamos ante un formateo en HFS o NTFS, en el valor del Volume UUID** que es una cadena alfanumérica bastante larga separada por guiones; **en caso de ser FAT**, no veremos eso pero por contra **tendremos un campo llamado Volume Name**. Y si hay dudas sobre qué tipo de formato viene aplicado en nuestra unidad de disco, en el campo Partition Type nos vendrá indicado. Ahora sólo queda editar el archivo que mencionábamos al principio, el **fstab**. Y para ello, tecleamos en Terminal este comando:

**sudo nano /etc/fstab**

Tras esto, y para poder editarlo, **nos solicitará la contraseña de administrador**. Si es la primera vez que nos la pide y no lo habíamos visto nunca, nos daremos cuenta que aunque estemos escribiéndola no aparece nada en pantalla... es un simple sistema de protección de privacidad, aunque no se vea nada, realmente está introduciéndola, así que seguimos introduciéndola y le damos a ENTER.

Lo más seguro es que este archivo este vacío, así que la primera línea será la nuestra. Si por lo que sea no lo está, pues lo que va a continuación lo introducimos debajo de lo que ya haya en el archivo.

### Para discos formateados en HFS...

La línea que deberíamos introducir sería esta:

**UUID=UUID none hfs ro,noauto 0 0**

Reemplazando lo que está en verde por la cadena alfanumérica que obtuvimos del paso anterior.

### Para discos formateados en NTFS...

La línea que deberíamos introducir sería esta:

**UUID=UUID none ntfs ro,noauto 0 0**

Reemplazando lo que está en verde por la cadena alfanumérica que obtuvimos del paso anterior.

### Para discos formateados en FAT...

La línea que deberíamos introducir sería esta:

**LABEL=NOMBRE none msdos rw,noauto 0 0**

Reemplazando lo que está en verde por el valor del Volume Name que obtuvimos del paso anterior.

### Finalizando...

Hecho esto **únicamente nos queda cerrar el archivo salvando cambios**. Para lo que deberemos pulsar CTRL+X, presionar Y para confirmar los cambios y ENTER para indicarle que sí queremos que nos lo guarde en ese archivo y no en otro.

Una vez todo completado sólo restará cerrar el Terminal, reiniciar nuestro equipo y comprobar felices como la dichosa partición a la que tanto asco le teníamos y que no queríamos ver ahí por ninguna de las maneras ya no se muestra y somos un poco más felices que antes. :D

### Montando la partición

**Este cambio, por supuesto, no es irreversible**. Si en un momento puntual queremos montar la partición siempre podemos irnos a la aplicación de **Utilidad de Discos**, seleccionar la partición que la encontraremos en la lista de la izquierda, y posteriormente darle al icono de Montar (en la barra de menú de arriba).

Si por contra, nos arrepentimos y queremos que siempre que iniciemos nuestra máquina se monte automáticamente (como ocurría antes de hacer todo esto); simplemente habrá que volver a editar el archivo fstab y, esta vez, eliminar la línea que habíamos introducido para evitar que se montara cada vez que se iniciara el sistema.

No era tan difícil, ¿no? ;)

\[ayuda\]
