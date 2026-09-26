# Wyznaczniki macierzy

## od definicji do interpretacji geometrycznej

<span class="muted">Algebra liniowa · prezentacja testowa</span>

---

# 1. Wyznacznik macierzy $2\times 2$

Dla macierzy

$$
A=
\begin{bmatrix}
a & b\\
c & d
\end{bmatrix}
$$

wyznacznik definiujemy jako

<div class="formula-box">

$$
\det(A)=ad-bc
$$

</div>

To jedna liczba przypisana macierzy kwadratowej.

---

# 2. Przykład

Niech

$$
A=
\begin{bmatrix}
3 & 2\\
5 & 4
\end{bmatrix}.
$$

Wtedy

$$
\det(A)=3\cdot 4-2\cdot 5=12-10=\boxed{2}.
$$

> Kolejność ma znaczenie: iloczyn głównej przekątnej minus iloczyn drugiej przekątnej.

---

# 3. Co oznacza wyznacznik geometrycznie?

Macierz $A$ opisuje przekształcenie liniowe.

Jeżeli

$$
A=
\begin{bmatrix}
a & b\\
c & d
\end{bmatrix},
$$

to wartość

$$
|\det(A)|
$$

jest współczynnikiem zmiany **pola**.

- $|\det(A)|=2$ — pola są dwa razy większe,
- $|\det(A)|=\tfrac12$ — pola są dwa razy mniejsze,
- $\det(A)=0$ — płaszczyzna zostaje „spłaszczona”.

---

# 4. Znak wyznacznika

Wyznacznik niesie także informację o **orientacji**.

$$
\det(A)>0
\quad\Longrightarrow\quad
\text{orientacja zachowana}
$$

$$
\det(A)<0
\quad\Longrightarrow\quad
\text{orientacja odwrócona}
$$

Przykład odbicia względem osi $y$:

$$
A=
\begin{bmatrix}
-1 & 0\\
0 & 1
\end{bmatrix},
\qquad
\det(A)=-1.
$$

---

# 5. Macierz $3\times 3$

Dla

$$
A=
\begin{bmatrix}
a_{11}&a_{12}&a_{13}\\
a_{21}&a_{22}&a_{23}\\
a_{31}&a_{32}&a_{33}
\end{bmatrix}
$$

możemy rozwinąć wyznacznik względem pierwszego wiersza:

$$
\det(A)=
a_{11}M_{11}
-a_{12}M_{12}
+a_{13}M_{13}.
$$

gdzie $M_{ij}$ oznacza odpowiedni minor.

---

# 6. Przykład $3\times 3$

$$
A=
\begin{bmatrix}
1&2&0\\
3&-1&2\\
2&1&1
\end{bmatrix}
$$

$$
\det(A)
=
1\begin{vmatrix}
-1&2\\
1&1
\end{vmatrix}
-
2\begin{vmatrix}
3&2\\
2&1
\end{vmatrix}
=-1.
$$

---

# 7. Operacje elementarne

| Operacja | Wpływ na wyznacznik |
|---|---|
| Zamiana dwóch wierszy | zmiana znaku |
| Pomnożenie wiersza przez $k$ | wyznacznik razy $k$ |
| Dodanie wielokrotności innego wiersza | bez zmian |

Dla macierzy trójkątnej:

$$
\det(A)=a_{11}a_{22}\cdots a_{nn}.
$$

---

# 8. Kiedy macierz jest odwracalna?

<div class="formula-box">

$$
A^{-1}\text{ istnieje}
\quad\Longleftrightarrow\quad
\det(A)\neq 0.
$$

</div>

Jeżeli $\det(A)=0$, kolumny są liniowo zależne.

---

# 9. Najważniejsze własności

$$
\det(AB)=\det(A)\det(B)
$$

$$
\det(A^T)=\det(A)
$$

$$
\det(A^{-1})=\frac{1}{\det(A)}
$$

---

# Podsumowanie

> Wyznacznik opisuje zmianę objętości, orientację i odwracalność przekształcenia.

$$
\boxed{\det(A)\neq 0 \iff A\text{ jest odwracalna}}
$$
