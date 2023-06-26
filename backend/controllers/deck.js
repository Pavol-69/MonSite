const express = require("Express");
const Deck = require("../models/Deck");

exports.createDeck = (req, res, next) => {
    const deck = new Deck({
        userId: req.body.userId,
        name: req.body.name
    });

    deck.save()
        .then(thing => res.status(200).json(thing))
        .catch(error => { res.status(400).json({ error }) })
};

// Ajout d'une carte dans la DeckList
exports.addCard = (req, res, next) => {
    
    // Recherche du deck en question
    Deck.findOne({ _id: req.body.deckId })
    .then((myDeck) => {
        
        // Vérification que l'utilisateur est bien proprietaire du deck
        if (myDeck.userId != req.body.userId) {
            res.status(401).json({ message: 'Non autorise' });
        } else {
            
            // Variable booléenne pour repérer si carte déjà présente dans DeckList
            let MyBool = true;

            // Récupération de la DeckList
            let MyTab = [];
            for (let i = 0; i< myDeck.cardList.length; i++) {

                /*for (let j = 0; j < 3; j++){
                    MyTab[i][j] = myDeck.cardList[i][j];
                };*/

                MyTab[i] = myDeck.cardList[i];
                
                // Vérification si la carte est déjà présente dans la liste, si c'est le cas, on incrémente juste sa quantité
                if(req.body.card.name == MyTab[i][0].name){
                    MyBool = false;
                    MyTab[i][1] = MyTab[i][1] + 1;
                }

            };

            // Intégration de la nouvelle si elle est nouvelle
            if(MyBool){MyTab.push([req.body.card,1,req.body.category])};

            // Màj de la BDD
            Deck.updateOne({ _id: req.body.deckId }, {
                    name : myDeck.name,
                    userId : myDeck.userId,
                    commander : myDeck.commander,
                    cardList : MyTab,
                    _id: req.body.deckId                    
                })
                .then(thing => res.status(200).json({ message: 'Carte ajoutée!' }))
                .catch(error => res.status(401).json({ error }));
        }
    });
};

exports.defineCommander = (req, res, next) => {
    Deck.findOne({ _id: req.body.deckId })
    .then((myDeck) => {
        if (myDeck.userId != req.body.userId) {
            res.status(401).json({ message: 'Non autorise' });
        } else {
            let MyTab = [];
            MyTab[0] = req.body.card
            Deck.updateOne({ _id: req.body.deckId }, {
                    name : myDeck.name,
                    userId : myDeck.userId,
                    commander : MyTab,
                    cardList : myDeck.cardList,
                    _id: req.body.deckId                    
                })
                .then(thing => res.status(200).json({ message: 'Commmandant défini!' }))
                .catch(error => res.status(401).json({ error }));
        }
    });
};

exports.changeDeckName = (req, res, next) => {
    Deck.findOne({ _id: req.body.deckId })
    .then((myDeck) => {
        if (myDeck.userId != req.body.userId) {
            res.status(401).json({ message: 'Non autorise' });
        } else {
            Deck.updateOne({ _id: req.body.deckId }, {
                    name : req.body.name,
                    userId : myDeck.userId,
                    commander : myDeck.commander,
                    cardList : myDeck.cardList,
                    _id: req.body.deckId                    
                })
                .then(thing => res.status(200).json({ message: 'Nom modifié' }))
                .catch(error => res.status(401).json({ error }));
        }
    });
};

exports.deleteCommander = (req, res, next) => {
    Deck.findOne({ _id: req.body.deckId })
    .then((myDeck) => {
        if (myDeck.userId != req.body.userId) {
            res.status(401).json({ message: 'Non autorise' });
        } else {
            let MyTab = []
            Deck.updateOne({ _id: req.body.deckId }, {
                    name : myDeck.name,
                    userId : myDeck.userId,
                    commander : MyTab,
                    cardList : myDeck.cardList,
                    _id: myDeck.deckId                    
                })
                .then(thing => res.status(200).json({ message: 'Commandant supprimé' }))
                .catch(error => res.status(401).json({ error }));
        }
    });
};

// Supprime une carte de la DeckList
exports.deleteCard = (req, res, next) => {
    
    // Recherche de la DeckList en particulier
    Deck.findOne({ _id: req.body.deckId })
    .then((myDeck) => {
        
        // On vérifie que c'est bien le propriétaire du deck qui le modifie
        if (myDeck.userId != req.body.userId) {
            res.status(401).json({ message: 'Non autorise' });
        } else {
            let j = -1;
            let k = 0;
            let MyTab = [];
            
            // Création d'une liste sans la carte en question, ou avec la quantité diminuée
            for (let i = 0; i< myDeck.cardList.length; i++) {
                
                // Si la carte n'a pas le même nom que celle que l'on veut supprimer, on ajoute à la liste
                if(myDeck.cardList[i][0].id != req.body.card.id){
                    j++;                
                    MyTab[j] = myDeck.cardList[i];

                } else {
                    
                    // Si la carte a le même nom mais que la quantité est supérieure à 1, on fait -1 à la quantité
                    if(myDeck.cardList[i][1] > 1){
                        j++;                
                        MyTab[j] = myDeck.cardList[i];
                        myDeck.cardList[i][1] = myDeck.cardList[i][1] - 1;
                    };
                };

            };

            // On écrase tout avec la liste que l'on vient de créer, qui est la même qu'avant, avec la carte en moins
            Deck.updateOne({ _id: req.body.deckId }, {
                    name : myDeck.name,
                    userId : myDeck.userId,
                    commander : myDeck.commander,
                    cardList : MyTab,
                    _id: req.body.deckId                    
                })
                .then(thing => res.status(200).json({ message: 'Carte supprimée!' }))
                .catch(error => res.status(401).json({ error }));
        }
    });
};

exports.getAllDecks = (req, res, next) => {
    Deck.find()
    .then(decks => res.status(200).json(decks))
    .catch(error => res.status(400).json({ error }));
};

exports.getMyDeck  = async (req, res) => {
    Deck.findOne({ _id: req.query.deckId })
        .then(deck => res.status(200).json(deck))
        //.then(deck => console.log(deck))
        .catch(error => res.status(400).json({ error }));
};

exports.getCommander  = async (req, res) => {
    Deck.findOne({ _id: req.query.deckId })
        .then(deck => res.status(200).json(deck.commander))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteDeck = (req, res, next) => {
    Deck.findOne({ _id: req.body.deckId })
    .then((deck) => {        
        if (deck.userId != req.body.userId) {
                    res.status(401).json({ message: 'Not authorized' });
                } else {
                    
                    Deck.deleteOne({ _id: req.body.deckId })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                }
            })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.deleteAllDecks = (req, res, next) => {
    Deck.find()
        .then((decks) => {
            let MyTab = [];
            for (let i = 0; i<decks.length; i++){
                MyTab[i]=decks[i]._id
            };
            Deck.deleteMany({MyTab})
                    .then(() => { res.status(200).json({ message: 'Tous les decks sont supprimés !' }) })
                    .catch(error => res.status(401).json({ error }));
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// Change la catégorie d'une carte
exports.changeCategory = (req, res, next) => {
    
    // Recherche du deck en question
    Deck.findOne({ _id: req.body.deckId })
    .then((myDeck) => {
        
        // Vérification que l'utilisateur est bien proprietaire du deck
        if (myDeck.userId != req.body.userId) {
            res.status(401).json({ message: 'Non autorise' });
        } else {
            
            let MyTab = myDeck.cardList;

            // Recherche de la carte
            for (let i = 0; i < myDeck.cardList.length; i++){
                //console.log(MyTab[i][2])
                // Une fois qu'on l'a trouvé, on peut changer la catégorie
                if (req.body.card == MyTab[i][0].name) {
                    MyTab[i][2] = req.body.name;
                };
            };

            // Màj de la BDD
            Deck.updateOne({ _id: req.body.deckId }, {
                    //name : myDeck.name,
                    //userId : myDeck.userId,
                    //commander : myDeck.commander,
                    cardList : MyTab
                    //_id: req.body.deckId                    
                })
                .then(thing => res.status(200).json({ message: 'Carte ajoutée!' }))
                .catch(error => res.status(401).json({ error }));
        }
    });
};