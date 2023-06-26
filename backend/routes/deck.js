const express = require('express');
const router = express.Router();

const deckCtrl = require('../controllers/deck');

router.post('/createDeck', deckCtrl.createDeck);
router.post('/addCard', deckCtrl.addCard);
router.post('/deleteCard', deckCtrl.deleteCard);
router.post('/defineCommander', deckCtrl.defineCommander);
router.post('/changeDeckName', deckCtrl.changeDeckName);
router.post('/deleteCommander', deckCtrl.deleteCommander);
router.post('/changeCategory', deckCtrl.changeCategory);
router.get('/getAllDecks', deckCtrl.getAllDecks);
router.get('/getMyDeck', deckCtrl.getMyDeck);
router.get('/getCommander', deckCtrl.getCommander);
router.delete('/deleteDeck', deckCtrl.deleteDeck);
router.delete('/deleteAllDecks', deckCtrl.deleteAllDecks);

module.exports = router;