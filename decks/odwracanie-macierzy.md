# Odwracanie macierzy

## macierz odwrotna w 10 krótkich krokach

<span class="muted">Algebra liniowa · prezentacja testowa</span>

---

# 1. Co znaczy „odwrócić” macierz?

Dla macierzy kwadratowej $A$ szukamy $A^{-1}$ takiej, że

$$
AA^{-1}=A^{-1}A=I.
$$

---

# 2. Kiedy odwrotność istnieje?

$$
\boxed{\det(A)\neq 0}
$$

Jeżeli $\det(A)=0$, macierz odwrotna nie istnieje.

---

# 3. Wzór dla $2\times 2$

$$
A=
\begin{bmatrix}
a&b\\
c&d
\end{bmatrix}
$$

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

# 4. Przykład

$$
A=
\begin{bmatrix}
2&1\\
5&3
\end{bmatrix}
$$

Ponieważ

$$
\det(A)=2\cdot3-1\cdot5=1,
$$

to

$$
A^{-1}=
\begin{bmatrix}
3&-1\\
-5&2
\end{bmatrix}.
$$

---

# 5. Kontrola wyniku

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

---

# 6. Metoda Gaussa-Jordana

Startujemy od

$$
[A\mid I].
$$

Operacjami na wierszach dążymy do

$$
[I\mid A^{-1}].
$$

---

# 7. Operacje elementarne

$$
R_i\leftrightarrow R_j
$$

$$
R_i\leftarrow \lambda R_i
$$

$$
R_i\leftarrow R_i+\lambda R_j
$$

---

# 8. Dlaczego to działa?

Jeżeli

$$
E_k\cdots E_2E_1A=I,
$$

to

$$
E_k\cdots E_2E_1=A^{-1}.
$$

---

# 9. Własność iloczynu

$$
(AB)^{-1}=B^{-1}A^{-1}.
$$

Kolejność się odwraca.

---

# 10. Podsumowanie

<div class="formula-box">

$$
AA^{-1}=I
$$

</div>

Macierz odwrotna istnieje dokładnie wtedy, gdy $\det(A)\neq0$.
