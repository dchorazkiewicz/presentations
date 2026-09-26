# Odwracanie macierzy

## macierz odwrotna w 10 krótkich krokach

<span class="muted">Algebra liniowa · prezentacja testowa</span>

---

# 1. Co znaczy „odwrócić” macierz?

Dla macierzy kwadratowej $A$ szukamy macierzy $A^{-1}$, takiej że

$$
AA^{-1}=A^{-1}A=I.
$$

To odpowiednik liczby odwrotnej:

$$
a\cdot \frac1a = 1.
$$

---

# 2. Kiedy odwrotność istnieje?

Macierz $A$ jest odwracalna wtedy i tylko wtedy, gdy

$$
\boxed{\det$A$\neq 0}.
$$

Jeżeli

$$
\det$A$=0,
$$

macierz jest osobliwa i $A^{-1}$ nie istnieje.

---

# 3. Wzór dla macierzy $2\\times 2$

Dla

$$
A=
\begin{bmatrix}
a&b\\
c&d
\end{bmatrix}
$$

mamy

$$
A^{-1}
=
\frac{1}{ad-bc}
\begin{bmatrix}
d&-b\\
-c&a
\end{bmatrix}.
$$

---

# 4. Przykład $2\\times 2$

Niech

$$
A=
\begin{bmatrix}
2&1\\
5&3
\end{bmatrix}.
$$

Najpierw

$$
\det$A$=2\cdot3-1\cdot5=1.
$$

Zatem

$$
A^{-1}=
\begin{bmatrix}
3&-1\\
-5&2
\end{bmatrix}.
$$

---

# 5. Kontrola wyniku

Sprawdzamy iloczyn:

$$
\begin{bmatrix}
2&1\\
5&3
\end{bmatrix}
\begin{bmatrix}
3&-1\\
-5&2
\end{bmatrix}
=
\begin{bmatrix}
1&0\\
0&1
\end{bmatrix}.
$$

Czyli rzeczywiście

$$
AA^{-1}=I.
$$

---

# 6. Metoda Gaussa-Jordana

Dla większych macierzy wygodna jest macierz rozszerzona:

$$
[A\mid I].
$$

Wykonujemy operacje elementarne na wierszach, aż otrzymamy

$$
[I\mid A^{-1}].
$$

---

# 7. Schemat

Start:

$$
\left[
\begin{array}{c|c}
A&I
\end{array}
\right]
$$

Operacje elementarne:

$$
R_i\leftrightarrow R_j,
\qquad
R_i\leftarrow \lambda R_i,
\qquad
R_i\leftarrow R_i+\lambda R_j.
$$

Cel:

$$
\left[
\begin{array}{c|c}
I&A^{-1}
\end{array}
\right].
$$

---

# 8. Dlaczego metoda działa?

Każda operacja elementarna odpowiada mnożeniu przez macierz elementarną $E$.

Jeżeli

$$
E_k\cdots E_2E_1A=I,
$$

to

$$
E_k\cdots E_2E_1=A^{-1}.
$$

---

# 9. Ważna własność

Dla odwracalnych macierzy:

$$
(AB)^{-1}=B^{-1}A^{-1}.
$$

Kolejność się odwraca.

Podobnie:

$$
(A^T)^{-1}=$A^{-1}$^T.
$$

---

# 10. Podsumowanie

Macierz odwrotna istnieje dokładnie wtedy, gdy

$$
\det$A$\neq0.
$$

Dla $2\\times 2$ mamy jawny wzór, a dla większych macierzy praktycznie używamy Gaussa-Jordana.

<div class="formula-box">

$$
AA^{-1}=I
$$

</div>
