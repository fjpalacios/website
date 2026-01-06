---
title: "Mínimo común múltiplo y máximo común divisor con calculadora"
date: "2016-10-11"
slug: "minimo-comun-multiplo-y-maximo-comun-divisor-con-calculadora"
---

Hasta ahora siempre había utilizado una calculadora… veterana, por decirlo de alguna manera. Ha tocado renovarse y ponerme a experimentar con ella. Algo que siempre odié de las matemáticas fue sacar el mínimo común múltiplo (m.c.m) y el máximo común divisor (m.c.d) mediante la descomposición de un número en factores primos. Es tedioso y lleva tiempo, aunque conozcas las reglas de divisibilidad y utilices la calculadora.

Afortunadamente las calculadoras más recientes nos facilitan mucho la vida en este sentido.

## Mínimo común múltiplo y máximo común divisor de dos números

Pongamos, por ejemplo, que queremos **sacar el m.c.m y el m.c.d de los números 180 y 252**.

Mediante la tecla **a b/c** en algunas Casio, o la que sirva en vuestro caso para introducir una fracción, introducimos esos dos números como numerador y denominador respectivamente: 180/252.

Al darle a la tecla de = la calculadora nos muestra la **fracción irreducible** de esa fracción, que en este caso es: 5/7.

¿Qué es lo que ha hecho la calculadora para mostrar la fracción irreducible? Sencillamente: **sacar automáticamente el máximo común divisor**, así que sabiendo qué número ha utilizado para llegar hasta ahí sabremos cuál es el m.c.d de esos dos números. ¿Y qué hacemos para saberlo? Dividir el numerador entre el numerador o el denominador entre el denominador de cada una de esas dos fracciones; yo voy a hacerlo todo el rato con los numeradores porque creo que es más visual, pero cada uno como prefiera: 180 ÷ 5 = 36.

**mcd(180,252) = 36**.

Ahora vamos con el mínimo común múltiplo. La forma de llegar hasta aquí es sabiendo que **la multiplicación de los números (180 y 252) da como resultado lo mismo que si multiplicamos su m.c.d por su m.c.m**. Ya sabiendo ya que el m.c.d es 36, sólo tenemos que multiplicar ambos números y dividirlos entre 36: (180 × 252) ÷ 36 = 1260.

**mcm(180,252) = 1260**.

## Mínimo común múltiplo y máximo común divisor de tres números

Ahora que ya sabemos cuál es la forma de desarrollo, vamos a ir un poco más rápido. También se puede sacar el m.c.d de tres o más números, pero es un pelín más entretenido. Vamos allá con los números: **180, 252 y 594**, por aprovechar un poco de lo ya hecho para los ejemplos. Los primeros pasos son idénticos:

180 ÷ 252 = 5/7
180 ÷ 5 = 36

Y aquí es cuando varía, porque siempre hay que hacer las divisiones por parejas; el numerador de la próxima fracción será el siguiente número al que le queda por sacar el m.c.d (594) y el denominador será el m.c.d que ya hemos obtenido de los dos primeros números (36).

594 ÷ 36 = 33/2
594 ÷ 33 = 18

**mcd(180,252,594) = 18**.

Como son los mismos números, el inicio para sacar el m.c.m es idéntico: (180 × 252) ÷ 36 = 1260.

Ahora hay que sacar el m.c.m de 594 y 1260, que es el m.c.m de los dos primeros números; de la misma forma que hemos visto antes, pero hay que poner en este caso como denominador el m.c.d de la segunda pareja de números (18): (594 × 1260) ÷ 18 = 41580.

**mcm(180,252,594) = 41580**.

## Mínimo común múltiplo y máximo común divisor de cuatro números

Vamos a liarlo un poco más, con cuatro números: **180, 252, 594 y 927**. Primero el m.c.d de los dos primeros números, de la misma forma:

180 ÷ 252 = 5/7
180 ÷ 5 = 36

Ahora el m.c.d del siguiente número (594) como numerador y el m.c.d de los dos anteriores (36) como denominador:

594 ÷ 36 = 33/2
594 ÷ 33 = 18

Ahora, de nuevo, el siguiente número (927) como numerador y el m.c.d de los dos anteriores (18) como denominador:

927 ÷ 18 = 103/2
927 ÷ 103 = 9

**mcd(180,252,594,927) = 9**.

Turno entonces del mc.m. Empezamos, como siempre, por el m.c.m de los dos primeros números: (180 × 252) ÷ 36 = 1260.

Ahora la multiplicación del siguiente número (594) por el m.c.m de los dos números anteriores (1260) como numeradores y el m.c.d de la segunda pareja de números (18) como denominador: (594 × 1260) ÷ 18 = 41580.

Y, por último, la multiplicación del número que queda (927) por el m.c.m de los dos anteriores (41580) como numeradores y el m.c.d de la tercera pareja de números (9) como denominador: (927 × 41580) ÷ 9 = 4282740.

**mcm(180,252,594,927) = 4282740**.
