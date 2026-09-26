# presentations

Statyczny viewer prezentacji oparty na Reveal.js.

## Architektura

- viewer/ jest wdrażany na GitHub Pages tylko wtedy, gdy zmienia się kod viewera.
- decks/ zawiera prezentacje Markdown.
- przeglądarka pobiera listę plików i treść slajdów bezpośrednio z gałęzi main przez GitHub Contents API.
- zmiana pliku w decks/ nie uruchamia deploymentu.

Nowa prezentacja = nowy plik decks/nazwa-prezentacji.md.
Slajdy rozdzielamy linią zawierającą trzy myślniki.

Wzory matematyczne są renderowane przez MathJax, a prezentacja przez Reveal.js.
