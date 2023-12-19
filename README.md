# Exploding-kittens
Projekt iz kolegija Računarski praktikum 2 čiji je rezultat igra nastala po uzoru na vrlo popularnu Exploding kittens. Video jedne partije na kojem je prikazana većina funkcionalnosti u igri može se vidjeti [ovdje](https://drive.google.com/file/d/1BHYNXl7HT4C8yyQZt-wjM93BcfeYrx9B/view?usp=drive_link).

## Autori

Roberto Grabovac,
Goran Ivanković,
Luis Pich Aguilera,
Zvonimir Vlaić

## Link za igranje
- [ovdje](https://rp2.studenti.math.hr/~robgrab/ek/main.php)

## Kako igrati

Igra je vrlo jednostavna. Prvo se ulogirajte (i registrirajte ako je potrebno). Zatim otvorite igru na gumb **create game**. Pozovite prijatelje da se priključe u vašu igru upisivanjem peteroznamenkastog koda u text box i klikom na gumb **join game**. Kada svi igrači kliknu ready, igra se pokreće. Upute o igri nalaze se u glavnom meniju.

## Struktura direktorija

Ovaj projekt prati MVC strukturu.

- `main.php`: Glavna skripta, na njoj se pokreće igra
- `init.php`: Uključivanje ostalih skripti
- `app`: Direktorij za bazu i neke zajedničke klase
- `controllers`: Controlleri u MVC strukturi - pozivaju view i postavljaju potrebne varijable
- `model`: Servisi za kontaktiranje baze i klase koji predstavljaju retke u bazi.
- `view`: Sav html za prikaz, zajedno s javascript skriptama za ajax pozive
- `css`: Css za html iz `view` direktorija
- `webserver`: Direktorij za kontaktiranje servera preko ajax poziva (za long pollanje i akcije tijekom igre)
    - wait.php: skripta za long pollanje
    - action.php: skripta za napraviti potez

## NAPOMENA
- baza podataka nalazi se na rp2 serveru, a zbog njezine privatnosti igru nije moguće pokrenuti na vlastitom računalu nakon preuzimanja repozitorija
- za dodatne upute o strukturi baze otići na `app/database/README.md`
- međutim, za pokretanje fali jedino ispunjavanje retka `17` u `app/database/db.class` podacima o odgovarajućoj bazi koju će igra koristiti tijekom svog izvršavanja
