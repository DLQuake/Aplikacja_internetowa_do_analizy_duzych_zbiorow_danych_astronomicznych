# Implementacja aplikacji internetowej do analizy danych pogodowych w celu przewidzenia prognozy pogody

Temat pracy magisterskiej polegający na stworzeniu aplikacji internetowej, która będzie wykorzystana do analizy dużych zbiorów danych pogodowych.

## Spis treści
* [Krótki opis repozytorium](#krótki-opis-repozytorium)
* [Technologie jakie zostaną użyte do pracy](#technologie-jakie-zostaną-użyte-do-pracy)
* [Koncepcja aplikacji](#koncepcja-aplikacji)
  * [Lista aktorów](#lista-aktorów)
  * [Lista przypadków użycia](#lista-przypadków-użycia)
  * [Struktura bazy danych](#struktura-bazy-danych)
    * [Opis struktury bazy danych](#opis-struktury-bazy-danych)
* [Dokumentacja](#dokumentacja)
* [Pobranie i klonowanie](#pobranie-i-klonowanie)

## Krótki opis repozytorium

W tym repozytorium powstała aplikacja internetowa, która umożliwia analizę danych pogodowych poprzez wykorzystanie dostępnych narzędzi oraz umożliwi wizualizacje danych za pomocą wykresów.

## Technologie jakie zostały użyte do pracy

- Front-end: [React.js](https://react.dev/)
- Back-end: [Express.js](https://expressjs.com/) oraz [Flask](https://flask.palletsprojects.com/en/3.0.x/)
- Bazy danych: [PostgreSQL](https://www.postgresql.org/)

## Koncepcja aplikacji

Do wykonania był projekt aplikacji internetowej Do analizy danych pogodowych. zapewnienie użytkownikom możliwości dostępu do aktualnych i historycznych danych pogodowych, a także ich analizy za pomocą zaawansowanych algorytmów przetwarzania danych. W tym celu powstała właśnie ta aplikacja by rozwiązać przedstawiony problem.

### Lista aktorów

* Aktorzy
    * Admin
    * Użytkownik

### Lista przypadków użycia

* Główne funkcjonalności
    * Autoryzacja użytkownika
        * Zarejestruj się
        * Zaloguj się
    * Zarządzanie kontami użytkowników
    * Zarządzanie tabel miejscowości
    * Zarządzanie tabel danych pogodowych
    * Przeglądanie Aktualnej pogody
    * Przeprowadzenie prognozy
    * Tworzenie raportu


### Struktura bazy danych

Do aplikacja została utworzona baza danych w PostgreSQL którego poniższy diagram przedstawia jego strukture

<div align="center">
  <img src="./images/diagramDB_Light.png.png#gh-light-mode-only" alt="Struktura bazy danych (jasny motyw)">
  <img src="./images/diagramDB_Dark.png#gh-dark-mode-only" alt="Struktura bazy danych (jasny motyw)">
</div>

#### Opis struktury bazy danych

* Tabela `forecast` Łączy się z tabelą `location` relacją jeden do wielu. Oznacza to, że jedna lokalizacja może mieć wiele prognoz
* Tabela `forecast` Łączy się z tabelą `report` relacją jeden do wielu. Oznacza to, że jeden raport może mieć wiele prognoz
* Tabela `report` Łączy się z tabelą `users` relacją jeden do wielu. Oznacza to, że jeden użytkownik może mieć wiele raportów
* Tabela `weatherdata` Łączy się z tabelą `location` relacją jeden do wielu. Oznacza to, że jedna lokalizacja może mieć wiele wpisów danych pogodowych

Reszta informacji znajduje się w dokumentacji w rozdziale [Dokumentacja](#dokumentacja)

## Dokumentacja

Dokumentacja początkowa znajduje się w postaci pliku PDF pod tym linkiem -> [LINK](https://github.com/DLQuake/Weather-Dashboard/tree/main/Dokumentacja/Pocz%C4%85tkowa/Dokumentacja_pocz%C4%85tkowa.pdf)

Dokumentacja końcowa znajduje sie w postaci pliku PDF pod tym linkiem -> [LINK](https://github.com/DLQuake/Weather-Dashboard/blob/main/Dokumentacja/Ko%C5%84cowa/Dokumentacja_ko%C5%84cowa.pdf)

W folderze dokumentacja znajdują sie także pliki Microsoft Word, które można pobrać.

## Pobranie i Klonowanie
Można pobrać repozytorium na dwa sposoby:

* ```
  git clone https://github.com/DLQuake/Weather-Dashboard.git
  ```
* [Download ZIP](https://github.com/DLQuake/Weather-Dashboard/archive/refs/heads/main.zip)
