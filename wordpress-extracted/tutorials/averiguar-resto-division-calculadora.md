---
title: "Averiguar el resto de una división con la calculadora"
date: "2016-11-12"
slug: "averiguar-resto-division-calculadora"
---

Partiendo de la base de que al hacer la operación con la calculadora nos ha dado un número decimal (porque si sólo tiene un número entero la división no tiene resto, y esto ya deberíamos de saberlo), vamos a averiguar cuál sería su resto en caso de no sacar ningún decimal al hacer la división.

Para ello voy a explicar tres opciones; las dos primeras, que **sirven para cualquier calculadora**, incluso si no es científica; y luego la tercera, que sólo se puede utilizar en algunas calculadoras científicas: en las que tienen un **modo base**, para poder convertir números entre las diferentes bases: binario, octal, decimal, hexadecimal, etc.

Para la representación de las operaciones a realizar la letra **a** corresponderá al dividendo; la **b** al divisor; en el cociente de la división la **x** corresponderá a la parte entera y la **y** a la parte decimal; la **z** es el resultado obtenido de multiplicar la parte entera del cociente por el divisor; y la **r** es el resto, lo que queremos averiguar. No en todos los casos se emplea la totalidad de las letras.

## Operando con decimales

Veamos la primera opción, haciendo los cálculos con las partes decimales de la operación. Primero la representación del conjunto de operaciones a realizar y después unos ejemplos con números.

a ÷ b = x,y
x,y - x = 0,y
0,y × b = r

Para el primer ejemplo vamos a calcular el resto de la siguiente división: 6539 ÷ 5.

6539 ÷ 5 = 1307,8
1307,8 - 1307 = 0,8
0,8 × 5 = 4

Ahora podemos concluir que el resto de 6539 ÷ 5 es **4**. Como se ve, el segundo paso consiste simplemente en obviar la parte entera del resultado y quedarnos únicamente con la decimal, por lo que **esta operación es innecesaria en la práctica**.

En el segundo ejemplo calcularemos el resto de la siguiente división: 5738 ÷ 73. Este caso es diferente, el _resto_ que nos da es periódico, por lo que tenemos que redondearlo para obtener el resto real.

5738 ÷ 73 = 78,602739726
78,602739726 - 78 = 0,602739726
0,602739726 × 73 = 43,999999998
≈ 44

Y de este modo, redondeando el resultado, sabemos que el resto de 5738 ÷ 73 es **44**.

## Operando con enteros

Tal y como podemos operar con las partes decimales de las diferentes operaciones, también podemos hacerlo con las partes enteras, aunque el proceso es algo diferente. La ventaja de este método es que es imposible que nos salga un número decimal, por lo que el resto que obtengamos será el correcto en cualquier caso.

a ÷ b = x,y
x × b = z
a - z = r

Vamos a trabajar con los mismos ejemplos que antes, así que en este primero buscaremos el resto de la división 6539 ÷ 5.

6539 ÷ 5 = 1307,8
1307 × 5 = 6535
6539 - 6535 = 4

Ya no es ningún misterio que el resto de la división 6539 ÷ 5 es **4**, pero quedándonos únicamente con las partes enteras de la división hemos ahorrado tiempo, sobre todo si el cociente tiene muchos decimales, como pasa en el próximo ejemplo.

Y sí, ahora vamos a calcular el resto de 5738 ÷ 73 pero con este nuevo método.

5738 ÷ 73 = 78,602739726
78 × 73 = 5694
5738 - 5694 = 44

Y aquí es donde en realidad podemos ver el tiempo que nos ahorramos usando este método respecto al anterior: hemos averiguado que el resto de 5738 ÷ 73 es **44** sin tener que redondear siquiera.

## Modo base

Pero si lo que buscamos es ahorrar tiempo el siguiente método no tiene rival. Si tenéis una calculadora molona seguro que os va a encantar. Para hacerlo de esta forma nuestra calculadora debe tener modo **base**: un modo para convertir números entre distintas bases (binario, octal, decimal, hexadecimal…). Y además debe permitir hacer operaciones desde ese modo. Éste es mi preferido porque lo simplifica todo ya que este modo sólo trabaja con números enteros: _no existen_ los decimales. Cuando entremos al modo base lógicamente tenemos que seleccionar el modo **decimal** para operar con él, que normalmente suele venir ya seleccionado directamente, pero por si acaso.

Y para muestra de sencillez, como comentaba anteriormente, esta es la representación de las pocas operaciones a realizar:

a - b(a ÷ b) = r

Y ya, con esto está todo. Vamos con el primer ejemplo con números: 6539 ÷ 5.

6539 - 5(6539 ÷ 5) = 4

Fácil y rápido, ¿eh? Hemos averiguado que el resto de 6539 ÷ 5 es **4** con el producto de una resta por una división, en una única operación con la calculadora.

El siguiente ejemplo, como hemos visto en los anteriores métodos, tenía un montón de decimales e incluso empleando el primer método había que redondear para obtener el resto que buscamos. Vamos a ver como todo eso en este modo base no afecta.

5738 - 73(5738 ÷ 73) = 44

Con este método, de la misma forma para cualquier número, como hemos visto, hemos calculado en pocos pasos que el resto de 5738 ÷ 73 es **44**.

Ahora ya es cosa vuestra, y del _poder_ de vuestra calculadora, cuál de estos tres métodos utilizar.

Espero que os haya sido útil esta información.
