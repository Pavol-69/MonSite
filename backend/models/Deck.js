const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const deckSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    commander: [{}],
    cardList: [{}], // contiendra un tableau à 2 dimensions avec autant de lignes que de cartes et 3 colonnes : la carte, sa quantité, sa catégorie
    categoryList: [{}]
});

deckSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Deck', deckSchema);