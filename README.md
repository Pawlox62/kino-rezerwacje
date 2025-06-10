# Kino Rezerwacje

Aplikacja webowa do rezerwowania miejsc w kinie z backendem Node.js/Express i frontendem React (Vite). Wykorzystuje Socket.IO do blokowania miejsc w czasie rzeczywistym oraz udostępnia panel administracyjny do zarządzania repertuarem.

## Struktura projektu

```
/         - główny katalog repozytorium
  client/ - aplikacja React (Vite)
  server/ - REST API Express z Socket.IO
```

## Szybki start

1. Zainstaluj zależności w obu katalogach:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. Otwórz plik `server/.env` i ustaw zmienne środowiskowe według upodobań, np.:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/kino
   JWT_SECRET=superTajneHaslo
   ```
3. Uruchom backend:
   ```bash
   cd server
   npm run dev
   ```
4. Uruchom frontend w nowym terminalu:
   ```bash
   cd client
   npm run dev
   ```
   Domyślnie aplikacja dostępna jest pod adresem `http://localhost:5173`, a API pod `http://localhost:4000/api`.

## Utworzenie konta administratora (MongoDB)

1. Zaloguj się do swojej bazy danych MongoDB (np. przez MongoDB Compass lub terminal).
2. Znajdź bazę `kino` oraz kolekcję `users`.
3. Odszukaj konto użytkownika, któremu chcesz nadać uprawnienia administratora.
4. Edytuj rekord i dodaj lub zmień pole `role` na wartość `"admin"`:

```json
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "password": "...",
  "role": "admin"
}
```

5. Zapisz zmiany.

## Testowanie i API

### Testy jednostkowe

W katalogu `server/` znajdują się testy Jest. Uruchomisz je poleceniem:
```bash
cd server
npm test
```

### Przykładowe zapytania HTTP

Korzystając z `curl` lub Postmana możesz wysłać m.in. takie żądania:

#### 1. Logowanie użytkownika

**Metoda:** POST
**URL:** `http://localhost:4000/api/auth/login`

**Nagłówki:**

* `Content-Type: application/json`

**Body (raw, JSON):**

```json
{
  "email": "user@example.com",
  "password": "haslo"
}
```

Po wykonaniu żądania w odpowiedzi otrzymasz token JWT.


#### 2. Pobranie listy filmów

**Metoda:** GET
**URL:** `http://localhost:4000/api/movies`

Nie są wymagane nagłówki ani body.


#### 3. Rezerwacja miejsc (z autoryzacją JWT)

**Metoda:** POST
**URL:** `http://localhost:4000/api/bookings`

**Nagłówki:**

* `Authorization: Bearer <TWÓJ_TOKEN>`
* `Content-Type: application/json`

**Body (raw, JSON):**

```json
{
  "showId": "<ID_SEANSU>",
  "seats": [
    { "row": 1, "number": 5 }
  ]
}
```
Upewnij się, że w polu Authorization wpisujesz poprawny token JWT uzyskany po zalogowaniu.

## Zmienne środowiskowe

- `PORT` – port serwera backendu
- `MONGO_URI` – adres bazy MongoDB
- `JWT_SECRET` – sekret używany do generowania tokenów

## Funkcje w czasie rzeczywistym i panel administracyjny

Socket.IO umożliwia blokowanie miejsc na sali w czasie rzeczywistym, dzięki czemu inne osoby od razu widzą, które miejsca są zajęte. Panel administracyjny pozwala na zarządzanie filmami, salami i seansami oraz przegląd statystyk obłożenia.
