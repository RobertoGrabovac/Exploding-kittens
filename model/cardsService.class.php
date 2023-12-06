<?php

class cardsService {
    public $exploding = "exploding", $defuse = "defuse", $nope = "nope";
    public $skip = "skip", $attack = "attack", $future = "future", $shuffle = "shuffle", $favor = "favor";

    function initCards($game_id) { // inicijalizira igru kartama. U decku su sve defuse karte (neovisno o broju igraca) te (broj_igraca - 1) exploding karata
        $db = DB::getConnection();

        $connectionsService = new ConnectionsService();
        $number_of_players = count($connectionsService->getConnectionsByGameId($game_id));
        
        if($this->isCardsInitialized($game_id)){
            return;
        }
        $j = 1;
        for ($i = 6 - $number_of_players; $i <= 56; $i++) {
            try
            {
                $st = $db->prepare( 'INSERT INTO proj_cards(game_id, card_id, belongs_to, position) VALUES ' .
                                '(:game_id, :card_id, 0, :position)' );
            
                $st->execute( array( 'game_id' => $game_id, 
                                    'card_id' => $i, 
                                    'position' => $j,
                                    ) );
            }
            catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
            $j++;
        }
    }

    function getFunctionalityByCardId($card_id) {
        try
        {
            $db = DB::getConnection();
            $st = $db->prepare( 'SELECT function FROM proj_functionality WHERE card_id=:card_id');
        
            $st->execute( array( 'card_id' => $card_id ) );
            return $st->fetch()[0];
        }
        catch( PDOException $e ) { exit( 'Database mistake cardsService.getFunctionalityByCardId: ' . $e->getMessage() ); }
    }

    function isCardsInitialized($game_id) { // provjerava je li dek inicijaliziran
        $deck_cards = $this->getDeckCards($game_id);
        if(count($deck_cards) == 0){
            return false;
        }
        else {
            return true;
        }
        
    }

    function userCardsNumber($game_id, $user_id) { // vraca broj karata igraca user_id; moze se koristiti i za broj karata u deck-u: $user_id = 0 ili u discard-pile: $user_id = -1
        $db = DB::getConnection();
        try {
            $st = $db->prepare('SELECT COUNT(*) FROM proj_cards WHERE belongs_to = :belongs_to AND game_id = :game_id');
            $st->execute(array(
                'belongs_to' => $user_id,
                'game_id' => $game_id
            ));
        
            $row_count = $st->fetchColumn();
        
            return (int) $row_count;
        } catch (PDOException $e) {exit('Database mistake: ' . $e->getMessage());};
        
    }

    function changeCardPosition($game_id, $card_id, $position) { // mijenja poziciju karte u position
        $db = DB::getConnection();
        try {
            $st = $db->prepare('UPDATE proj_cards SET position = :position WHERE card_id = :card_id AND game_id = :game_id');
        
            $st->execute(array(
                'position' => $position,
                'card_id' => $card_id,
                'game_id' => $game_id
            ));

        } catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }

    function getDeckCards($game_id) { // vraca polje u kojem se nalaze id karata u decku neke igre
        $db = DB::getConnection();
        $array = [];
        $deck_positioned = 0;
        try {
            $st = $db->prepare('SELECT card_id FROM proj_cards WHERE belongs_to = :belongs_to AND game_id = :game_id ORDER BY position ASC');
            $st->execute(array(
                'belongs_to' => (int) $deck_positioned,
                'game_id' => $game_id
            ));

            while ($row = $st->fetch())
                $array[] = $row['card_id'];
        
            return $array;
        } catch (PDOException $e) {exit('Database mistake: ' . $e->getMessage());};
    }

    function getPlayerCards($game_id, $user_id) {
        $db = DB::getConnection();
        $array = [];
        try {
            $st = $db->prepare('SELECT card_id FROM proj_cards WHERE belongs_to = :belongs_to AND game_id = :game_id ORDER BY position ASC');
            $st->execute(array(
                'belongs_to' => $user_id,
                'game_id' => $game_id
            ));

            while ($row = $st->fetch())
                $array[] = $row['card_id'];
        
            return $array;
        } catch (PDOException $e) {exit('Database mistake: ' . $e->getMessage());};
    }
 
    function shuffle($game_id) { // mijesa karte
        $deckCards = $this->getDeckCards($game_id);
        
        $shuffle_array = range(1, count($deckCards));
        shuffle($shuffle_array); 
        
        for ($i = 0; $i < count($deckCards); $i++) 
            $this->changeCardPosition($game_id, $deckCards[$i], $shuffle_array[$i]);
    }

    // mijenja mjesto karte; npr. za $belongs_to = 0 ju stavljamo u deck; za $belongs_to = user_id ju dajemo igracu s id user_id i slicno
    // kada se ova funkcija koristi, treba se paziti na poredak ostatka karata. Npr. ako ju koristimo kada implementiramo to da igrac daje kartu igracu,
    // onda se moraju azurirati pozicije preostalih karata uz pomoc updateCardPositions()
    
    // NAPOMENA: ovo je opcenitija verzija od playerGiveCard(). Bolje je koristiti playerGiveCard() kada dajemo kartu igracu jer ona po defaultu stavlja tu kartu na 
    // desni kraj player-ovog pile-a te nakon nje nije potrebno update-ati poziciju igraca koji je dobio kartu, vec samo poziciju karata davatelja (to moze biti deck ili drugi igrac)  
    function setCardBelongsTo($game_id, $card_id, $belongs_to) {
        $db = DB::getConnection();

        try {
            $st = $db->prepare('UPDATE proj_cards SET belongs_to = :belongs_to WHERE card_id = :card_id AND game_id = :game_id');
        
            $st->execute(array(
                'belongs_to' => $belongs_to,
                'card_id' => $card_id,
                'game_id' => $game_id
            ));
        } catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }

    // funkcija za stavljanje karata igracu. Igracu se pojavljuje karta na desnom kraju. UVIJEK KORISTITI OVU FUNKCIJU KADA SE KARTA DAJE IGRACU!!
    // update-ati karte igrača koji daje kartu
    function playerGiveCard($game_id, $card_id, $user_id) {
        $number = $this->userCardsNumber($game_id, $user_id) + 1;
        $db = DB::getConnection();

        try {
            $st = $db->prepare('UPDATE proj_cards SET belongs_to = :belongs_to, position = :position WHERE card_id = :card_id AND game_id = :game_id');
        
            $st->execute(array(
                'belongs_to' => $user_id,
                'position' => $number,
                'card_id' => $card_id,
                'game_id' => $game_id
            ));
        } catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }

    // funkcija se koristi nakon sto kartu $card_id negdje prebacimo (promijenimo atribut $belongs_to)
    // $what = 0 ==> updateamo deck; $what = $user_id ==> updateamo pozicije karata igraca $user_id; $what = -1 ==> updateamo pozicije discard pile-a
    function updateCardPositions($game_id, $what) {
        $db = DB::getConnection();
        switch($what) {
            case -1:
                $discardPileCards = $this->getPlayerCards($game_id, -1);
                
                for ($i = 0; $i < count($discardPileCards); $i++) 
                    $this->changeCardPosition($game_id, $discardPileCards[$i], ($i + 1));

                break;
            case 0: 
                $deckCards = $this->getDeckCards($game_id);
                
                for ($i = 0; $i < count($deckCards); $i++) 
                    $this->changeCardPosition($game_id, $deckCards[$i], ($i + 1));

                break;
            default:
                $playerCards = $this->getPlayerCards($game_id, $what);

                for ($i = 0; $i < count($playerCards); $i++) 
                    $this->changeCardPosition($game_id, $playerCards[$i], ($i + 1));

                break;
        }
    }

    function getPlayerByCard_id($game_id, $card_id) {
        $db = DB::getConnection();
        try {
            $st = $db->prepare('SELECT belongs_to FROM proj_cards WHERE card_id = :card_id AND game_id = :game_id');
        
            $st->execute(array(
                'card_id' => $card_id,
                'game_id' => $game_id
            ));

            $row = $st->fetch();
            return (int) $row['belongs_to'];
        } catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }

    // azurirati pozicije karata igraca nakon koristenja ove funkcije
    // uociti kako se koriste pomocne funkcije kada netko (1) daje karte nekom drugom (2): getPlayerByCard_id() -> setCardBelongsTo() -> updateCardPositions(1) -> updateCardPositions(2)
    function deckInsertCard($game_id, $card_id, $where) {
        $player = $this->getPlayerByCard_id($game_id, $card_id);
        if ($player == 0) return; // ako bi slucajno se dogodilo da se karta stavlja iz deck-a u deck. Ovo je namjenjeno samo za player -> deck
        switch($where) {
            case "top":
                $this->setCardBelongsTo($game_id, $card_id, 0);  
                $deckCardsNumber = $this->userCardsNumber($game_id, 0); // broj karata u decku, ajmo reci da je deck specijalni user hehe
                $this->changeCardPosition($game_id, $card_id, $deckCardsNumber);
                $this->updateCardPositions($game_id, $player);
                // $this->updateCardPositions($game_id, 0); uoci da nije potrebno update karata decka
                break;
            case "bottom":
                $this->setCardBelongsTo($game_id, $card_id, 0);
                $this->changeCardPosition($game_id, $card_id, 0); // stavljam da je karta na pozciji 0 jer ako stavim da je na poziciji 1, onda ne znam koju ce sortiranje prije staviti kao prvu - prijasnju prvu ili ovu koju dodajemo
                $this->updateCardPositions($game_id, $player);
                $this->updateCardPositions($game_id, 0);
                break;
            case "random":
                $deckCards = $this->getDeckCards($game_id);
                $randomNumber = rand(1, count($deckCards) + 1); //  + 1 da moze zavrsiti i na vrhu
                $this->setCardBelongsTo($game_id, $card_id, 0);
                $this->changeCardPosition($game_id, $card_id, $randomNumber);
                $this->updateCardPositions($game_id, $player);
                $this->updateCardPositions($game_id, 0);
                break;
            default:
                echo "Nepodrzani switch parametar u deckInsertCard()";
                break;
        }
    }

    // vraca polje elemenata tipa Card koja sadrzi podatke o tome u kojoj je igri (game_id), vlastiti id (card_id), kome pripada (belongs_to),
    // pozicija (position) i funkciju koju poziva (function). Karte su radi preglednosti poredane uzlazno po pripadanju, a onda po poziciji.
    // TODO: testirati
    function getCurrentGameCardsStatus($game_id) {
        $db = DB::getConnection();
        
        try {
            $st = $db->prepare('SELECT * FROM proj_cards, proj_functionality WHERE proj_cards.card_id = proj_functionality.card_id AND game_id = :game_id ORDER BY belongs_to ASC, position ASC');
            $st->execute(array( 'game_id' => $game_id ));
        } catch (PDOException $e) {exit('Database mistake: ' . $e->getMessage());};

        $cards = [];
        
        while ($row = $st->fetch())
            $cards[] = new Card($row['game_id'], $row['card_id'], $row['belongs_to'], $row['position'], $row['function']);
        
        return $cards;
    }

    //  TODO: testirati
    function getTop3DeckCards($game_id) { // funkcija za kartu see the future
        $deck_cards = $this->getDeckCards($game_id);

        if (count($deck_cards) <= 3)
            return $deck_cards;
        
        $top3 = [];
        $top3[] = $deck_cards[count($deck_cards) - 1];
        $top3[] = $deck_cards[count($deck_cards) - 2];
        $top3[] = $deck_cards[count($deck_cards) - 3];

        return $top3;
    }

    function getTopDeckCard($game_id) { // funkcija vraca gornju kartu s deka
        $deck_cards = $this->getDeckCards($game_id);

        //dodati provjeru praznog deka
        return $deck_cards[count($deck_cards)-1];
    }

    function deleteGame($game_id) { // ova se funkcija poziva na kraju igre za brisanje svih podataka
        $db = DB::getConnection();
        try {
            $st = $db->prepare('DELETE FROM proj_cards WHERE game_id = :game_id');
            $st->execute(array(
                'game_id' => $game_id
            ));
        } catch (PDOException $e) {exit('Database mistake: ' . $e->getMessage());};
    }

    function isDefuseCardDealt($game_id) { // ??? OPREZNO! funkcija za provjeru jesu li Defuseovi podijeljeni svim igracima
        $deck_cards = $this->getDeckCards($game_id);
        $connectionsService = new ConnectionsService();
        $number_of_players = count($connectionsService->getConnectionsByGameId($game_id));

        if (count($deck_cards) == (56 - 4 - $number_of_players))
            return true;
        else 
            return false;
    }

    function getTopDiscardPileCardId($game_id) {
        $discardPileCards = $this->getPlayerCards($game_id, -1); // -1 je "player" koji je discard pile pa reuse-am funkciju
        if(count($discardPileCards) > 0){
            return $discardPileCards[count($discardPileCards) - 1];
        }
        else {
            return -1;
        }
    }

    function discardCard($game_id, $card_id) {
        $user_id = $this->getPlayerByCard_id($game_id, $card_id);
        $this->setCardBelongsTo($game_id, $card_id, -1);

        $this->updateCardPositions($game_id, $user_id);
        $this->updateCardPositions($game_id, -1);
    }
}

?>