# Kino Rezerwacje

Aplikacja webowa do rezerwowania miejsc w kinie z backendem Node.js/Express i frontendem React (Vite). Wykorzystuje Socket.IO do blokowania miejsc w czasie rzeczywistym oraz udostępnia panel administracyjny do zarządzania repertuarem.

## Szybki start

1. Zainstaluj zależności w obu katalogach:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. Utwórz plik `server/.env` i ustaw zmienne środowiskowe, np.:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/kino
   JWT_SECRET=superTajneHaslo
   STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXX
   TEST_PAYMENTS=true
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

## Testowanie i API

### Testy jednostkowe

W katalogu `server/` znajdują się testy Jesta. Uruchomisz je poleceniem:
```bash
cd server
npm test
```

### Przykładowe zapytania HTTP

Korzystając z `curl` lub Postmana możesz wysłać m.in. takie żądania:

- logowanie użytkownika
  ```bash
  curl -X POST http://localhost:4000/api/auth/login \
       -H 'Content-Type: application/json' \
       -d '{"email":"user@example.com","password":"haslo"}'
  ```
- lista filmów
  ```bash
  curl http://localhost:4000/api/movies
  ```
- rezerwacja miejsc (wymaga tokenu JWT)
  ```bash
  curl -X POST http://localhost:4000/api/bookings \
       -H 'Authorization: Bearer <TOKEN>' \
       -H 'Content-Type: application/json' \
       -d '{"showId":"<ID_SEANSU>","seats":[{"row":1,"number":5}]}'
  ```

## Zmienne środowiskowe

- `PORT` – port serwera backendu
- `MONGO_URI` – adres bazy MongoDB
- `JWT_SECRET` – sekret używany do generowania tokenów
- `STRIPE_SECRET_KEY` – klucz API Stripe
- `TEST_PAYMENTS` – włącza tryb testowych płatności

## Funkcje w czasie rzeczywistym i panel administracyjny

Socket.IO umożliwia blokowanie miejsc na sali w czasie rzeczywistym, dzięki czemu inne osoby od razu widzą, które miejsca są zajęte. Panel administracyjny pozwala na zarządzanie filmami, salami i seansami oraz przegląd statystyk obłożenia.

## Struktura projektu

```
/         - główny katalog repozytorium
  client/ - aplikacja React (Vite)
  server/ - REST API Express z Socket.IO
```

## Licencja

Repozytorium nie zawiera pliku z licencją.

