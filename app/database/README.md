# Baze podataka ze Exploding kittens

## POPIS TABLICA
- ek_users
- proj_games
- proj_connections
- proj_functionality
- proj_cards
- proj_moves


## DETALJNO O TABLICAMA

### ek_users
id | username | password_hash | email | registration_sequence | has_registered
- standardna tablica za spremanje podataka o korisnicima (login / register)


### proj_games
id | code | game_state | current_player_id | moves_to_play | lastModified
- tablica samo za popis igri
- code: 5-znamenkasti string za kod igrice (koristi se za join game)
- game_state:
	0 - otvorena za spajanje
	1 - u stanju igranja
	2 - igra završena
- current_player_id = koji je igrač na potezu
- moves_to_play = broj poteza koji trenutni igrač treba odigrati (primjerice
  ako je odigran attack prije, ovo će biti postavljeno na 2)
- lastModified = timestamp za long pollanje


### proj_connections
user_id | game_id | user_state | order_of_play
- popis konekcija u igri
- user_id = korisnik spojen na igru
- game_id = igra na koju je korisnik spojen
- user_state:
	0 - gleda igru (mrtav je u igri / nije spreman u lobbiju)
	1 - živ je (ili ako je u lobbiju, spreman za igru)
- order_of_play = brojevi od 1 do broj_igrača, označava koji je igrač po redu na potezu
- ključ je (user_id, game_id). Nije samo user_id tako da se ne brinemo oko brisanja konekcija


### proj_functionality
card_id | function
- obilježava deck karata. Svaka karta ima jedinstven id, ali više karti može imati istu
  funkcionalnost (npr. više attack karti)
- card_id = id svake karte
- function = string za funkcionalnost karte, može biti "attack", "skip", "future" itd.
- ključ je (card_id)


### proj_moves
game_id | user_id | card_id | move_number | finished
- popis svih poteza za svaku igru, koristi se za dohvaćanje posljednjeg poteza radi animacija
  i radi nopeanja
- game_id = igra za koju spremamo potez
- user_id = igrač koji je odigrao potez
- card_id = id koji označava odigranu kartu (svaka od 50-ak karti ima jedinstven id)
- move_number = broj poteza po redu (prvi će biti 1., drugi 2., itd.), tako da se mogu poredati
  i dohvatiti posljednji potez
- finished = specifično za kompliciranije karte poput see the future, koje zahtijevaju posebnu 
  interakciju igrača. 0 je na bačenu kartu, 1 je za dovršenu akciju
- ključ je (game_id, user_id, card_id) jer su to jedinstvene stvari koje obilježavaju potez
  (možda je moglo i samo (game_id, card_id), ali nije prebitno...)


### proj_cards
game_id | card_id | belongs_to | position
- popis gdje se koja karta nalazi, može biti u decku na nekoj poziciji ili u nečijoj ruci
- game_id = igra u kojoj gledamo karte
- card_id = karta kojoj spremamo poziciju
- belongs_to = user_id ili 0 za deck ili -1 za discard pile
- position = pozicija karte npr. u špilu (bitan je poredak zbog karte explode)