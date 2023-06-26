const MyButtonSearch = document.getElementById("Bouton_Rechercher");
const MyAfficherMenuSearchButton = document.getElementById("MonBoutonMenuRecherche");
const MyButtonReinit = document.getElementById("Bouton_Reinitialisation");
const MySearchMenu = document.getElementById("MaCaseRecherche");
const MySearchMenu_Visu = document.getElementById("MenuRecherche");
const MySearchMenu_Close = document.getElementById("Recherche_Bouton_Fermer");
const MyBar = document.getElementById("MaBarre");
const MySugg = document.getElementById("MesSuggestions");
const MyBody = document.getElementById("MonBody");
const MyColors = document.getElementsByClassName("Couleur");
const MyColors_Hover = document.getElementsByClassName("Couleur_hover");
const MyTypeCarte = document.getElementById("RechercheTypeCarte");
const MySearchResult = document.getElementById("Resultat_Recherche");
const MyMainField = document.getElementById("MyMainField");
const MyTypeButton = document.getElementById("MonBoutonClassementType");
const MyCommanderInfos = document.getElementById("InfoSDeckTextuelles");
const MyCMCButton = document.getElementById("MonBoutonClassementCMC");
const MyCatButton = document.getElementById("MonBoutonClassementCat");

let MyString = "";
let MyCardsNameTab = [""];
let MyCardsSearchTab = [""];
let MyCardsListTab = [""];
let MyCard = [""];
let MyVerif = false;
let k = -1;
let MyDeck = [];

let MyOrder = "ByCat";

UpdateCardList();

// Fonction pour décaler toutes les carte en dessous de celle que l'on souhaite voir
// On va analyser tout ce sur quoi la souris passe par dessus dans MyMainField, s'il s'agit d'une vignette, alors on décale tout ce qu'il y a en dessous
MyMainField.addEventListener('mouseover', event => {
    
    // Réinitialisation des positions avant toute chose
    TuilageCarte();

    // Comme les vignettes sont juste un groupement de plusieurs éléments, on vérifie que le parent est bien vignette de l'élément en question
    if(event.target.parentNode.className.indexOf("Vignette_Carte") != -1) {
        let MyVignette = event.target.parentNode
        let MyGroup = MyVignette.parentNode;

        // Pour passe en revu chaque élément du groupe
        for (let i = 0; i < MyGroup.childNodes.length; i++) {
            
            // Si la position d'un élément est en dessous de la carte sur laquelle est la souris, alors on le descend
            if (Number(MyGroup.childNodes[i].style.top.replace("px", "")) > Number(MyVignette.style.top.replace("px", ""))){
                let MyTop = 0;
                MyTop = Number(MyGroup.childNodes[i].style.top.replace("px", "")) + 280; // Attention à passer Number(), sinon c'est du texte
                MyGroup.childNodes[i].style.top = MyTop + "px";
            };
        }

        // On adapte également le cadre du groupe
        // On prends le .top du dernier élément, auquel on rajoute 305 + 10px
        let MyTopGroup = Number(MyGroup.childNodes[MyGroup.childNodes.length - 1].style.top.replace("px", "")) + 295;
        MyGroup.style.height = MyTopGroup + "px";
    } else {
        TuilageCarte()
    };
});

// Tri les cartes par CMC
MyCMCButton.addEventListener('click', function () {
    MyMainField.innerHTML = "";
    MyOrder = "ByMana"
    UpdateCardList();
});

// Tri les cartes par Type
MyTypeButton.addEventListener('click', function () {
    MyMainField.innerHTML = "";
    MyOrder = "ByType";
    UpdateCardList();
});

// Tri les cartes par Catégorie
MyCatButton.addEventListener('click', function () {
    MyMainField.innerHTML = "";
    MyOrder = "ByCat";
    UpdateCardList();
});

// Affichage menu recherche
MyAfficherMenuSearchButton.addEventListener('click', function () {
    MySearchMenu_Visu.style.visibility = "visible"
    MySearchMenu_Visu.style.zIndex = "3";
});

// Fermeture menu recherche
MySearchMenu_Close.addEventListener('click', function () {
    MySearchMenu_Visu.style.visibility = "hidden"
    MySearchMenu_Visu.style.zIndex = "0";
});

// Affichage des suggestions dès qu'on écrit qq chose, sinon on cache
if (MyBar.value.length > 1) {
    MySugg.style.visibility = 'visible';

} else {
    MySugg.style.visibility = 'hidden';
    MySugg.innerHTML = "";
};

// Recensement de tous les noms potentiels, sans doublon
MyBar.addEventListener('click', function () {
    MyCardsNameTab = [];
    k = -1;
    fetch("https://api.magicthegathering.io/v1/cards?page=1") // recherche dans la bdd
        (res => {
            if (res.ok) {

                res.json().then(data => {
                    for (let i = 0; i < data.cards.length; i++) { // parcours de tous les noms
                        MyVerif = false;
                        for (let j = 0; j < MyCardsNameTab.length; j++) { // parcours de notre tableau, MyVerif se met à true si le nom existe déjà
                            if (data.cards[i].name == MyCardsNameTab[j]) { MyVerif = true }
                        }
                        if (MyVerif == false) {
                            k++
                            MyCardsNameTab[k] = data.cards[i].name; // ajout du nom à la liste, s'il n'existe pas déjà
                        };
                    }
                })
            } else {
                console.log("Erreur");
            };
        });
});

// ajout suggestion en dessous de la barre de recherche
MyBar.addEventListener("keyup", function () {
    const input = MyBar.value;
    const result = MyCardsNameTab.filter(item => item.toLocaleLowerCase().includes(input.toLocaleLowerCase()));

    let suggestion = "";

    if (input.length > 1) {
        MySugg.style.visibility = 'visible';
        MySugg.style.zIndex = 2;
        MyBoolSugg = false;
        result.forEach(resultItem =>
            suggestion += "<div class=\"MaClasseSugg\">" + resultItem + "</div>"
        )
        MySugg.innerHTML = suggestion;
    } else {
        MySugg.style.visibility = 'hidden';
        MySugg.style.zIndex = 0;
        MySugg.innerHTML = "";
    };
});

// ajout de la suggestion à la barre de recherche
MySugg.addEventListener("click", function () {
    const MyChoise = document.querySelectorAll(".MaClasseSugg:hover");
    MySugg.style.visibility = 'hidden';
    MyBar.value = MyChoise[0].innerHTML;
    MySugg.innerHTML = "";
});

// Gestion de tous les cliques sur le menu recherche
MySearchMenu.addEventListener("click", event => {

    // Changement d'apparence quand on clique sur les couleurs
    if (event.target.className == "Couleur") {
        event.target.className = "Couleur_hover";
    } else {
        if (event.target.className == "Couleur_hover") {
            event.target.className = "Couleur";
        };
    };
});

// Réinitialisation des options de recherche
MyButtonReinit.addEventListener('click', function () {
    ReinitialisationRecherche()
});

function ReinitialisationRecherche() {
    MyBar.value = "";
    MySugg.style.visibility = 'hidden';
    for (let i = MyColors_Hover.length - 1; i >= 0; i--) {
        MyColors_Hover[i].className = "Couleur";
    };
    MyTypeCarte.value = "All";
    MySearchResult.innerHTML = "";
};

// Lancer une recherche
MyButtonSearch.addEventListener('click', function () {
    MySearchResult.innerHTML = "";
    MySugg.style.visibility = "hidden"
    MyCardsSearchTab = [];
    k = -1;
    let MyBool_Color = false;
    let MyBool_Type = false;

    GetMyDeck()
        .then(MyDeck => {
            fetch("https://api.magicthegathering.io/v1/cards?page=1")
                .then(res => {
                    if (res.ok) {
                        res.json().then(data => {
                            for (let i = 0; i < data.cards.length; i++) {

                                // Vérificaion du nom
                                if (data.cards[i].name.toLocaleLowerCase().includes(MyBar.value.toLocaleLowerCase()) && data.cards[i].imageUrl != undefined) {

                                    let MyBool_Color = false;
                                    let MyBool_Type = false;

                                    // Vérification de la couleur
                                    for (let j = 0; j < MyColors.length; j++) {
                                        for (let k = 0; k < data.cards[i].colorIdentity.length; k++) {
                                            if (data.cards[i].colorIdentity[k] == MyColors[j].id) { MyBool_Color = true };
                                        };
                                    };

                                    // Vérification du type
                                    for (let k = 0; k < data.cards[i].types.length; k++) {
                                        if (data.cards[i].types[k] == MyTypeCarte.value || MyTypeCarte.value == "All") { MyBool_Type = true };
                                    };

                                    if (MyBool_Color == true && MyBool_Type == true) {
                                        k++;
                                        MyCardsSearchTab[k] = data.cards[i];
                                    };
                                };
                            };
                            for (let i = 0; i < MyCardsSearchTab.length; i++) {

                                // Determination de la quantité
                                let MyQuantity = 0;
                                for (let j = 0; j < MyDeck.cardList.length; j++) {
                                    if (MyCardsSearchTab[i].name == MyDeck.cardList[j][0].name){MyQuantity = MyDeck.cardList[j][1]};
                                };

                                const MyDiv = CreationVignetteCarte(MyCardsSearchTab[i], MyDeck.userId, MyQuantity, true);
                                MySearchResult.appendChild(MyDiv);
                            };
                        })
                    } else {
                        console.log("Erreur dans recherche");
                    }
                })
        });
});

// Création Vignette intégrant Carte + Boutons, qu'on utilisera pour chacune des cartes de la page
function CreationVignetteCarte(MyCardData, MyDeckUserId, MyCardQuantity, IsSearch) {    
    
    // Le div général de la bignette
    const MyVignette = document.createElement("div");

    // On différencie les vignette venant de la recherche de celles venant de a DeckList
    if(IsSearch){
        MyVignette.className = "Vignette_Carte Vignette_Recherche";
    } else {
        MyVignette.className = "Vignette_Carte Vignette_Carte_Decklist";
        MyVignette.id = MyCardData.name;
    };
    
    // Intégration de l'image
    const MyImg = document.createElement("img");
    MyImg.src = MyCardData.imageUrl;
    MyImg.className = "Img_Carte";
    MyImg.setAttribute('draggable', false); // On fait en sorte que l'utilisateur ne puisse pas y sélectionner
    MyVignette.appendChild(MyImg);

    // Création d'une case avec la quantité
    const MyQuantity  = document.createElement("div");
    MyQuantity.className = "Groupe_Quantite"
    MyQuantity.innerHTML = MyCardQuantity;
    MyVignette.appendChild(MyQuantity);

    // Intégration des bouton + et -, unniquement si l'utilisateur est le propriétaire du deck
    if (sessionStorage.getItem('idUser') == MyDeckUserId) {
        const MyButtonPlus = document.createElement("div");
        MyButtonPlus.textContent = "+";
        MyButtonPlus.className = "MyPlus CardButton";
        MyVignette.appendChild(MyButtonPlus);
        MyButtonPlus.addEventListener('click', () => {
            AjoutCarteADeckList(MyCardData, "Aucune Catégorie")
            .then(MyDeck => {
                MajVignette(MyCardData, MyVignette, IsSearch);
                if(IsSearch){UpdateCardList()};
            })
        });

        const MyButtonMinus = document.createElement("div");
        MyButtonMinus.textContent = "-";
        MyButtonMinus.className = "MyMinus CardButton";
        MyVignette.appendChild(MyButtonMinus);
        MyButtonMinus.addEventListener('click', () => {
            RetirerCarteDeDeckList(MyCardData)
            .then(MyDeck => {
                MajVignette(MyCardData, MyVignette, IsSearch);
                if(IsSearch){UpdateCardList()};
            })
        });
    };
    
    return MyVignette;
}

// Met à jour MyVignette selon les dernières infos dans la bdd
function MajVignette(MyCardData, MyVignette, IsSearch) {
    
    let MyQty = 0;
    
    // Récupération des infos de MyDeck
    GetMyDeck()
        .then(MyDeck => {
            
            let MyDivQty = 0;

            // Récupération du div avec la quantité
            for (let j = 0; j < MyVignette.childNodes.length; j++){
                if (MyVignette.childNodes[j].className == "Groupe_Quantite"){MyDivQty = MyVignette.childNodes[j]};
                };
            
            // Recherche de la carte intégrée dans MyVignette
            for (let i = 0; i < MyDeck.cardList.length; i++) {
                if(MyCardData.name == MyDeck.cardList[i][0].name){
                    
                    // Màj quantié
                    MyQty = MyDeck.cardList[i][1];
                    MyDivQty.innerHTML = MyQty;

                };
            };

            // Cas particulier où quantité = 0, aucune info dans bdd, donc boucle ci-dessus non parcourue
            // Il faut mettre à jour la quantité pour les recherches qui indiquent bien les valeurs 0
            if(MyQty == 0 && IsSearch == true) {MyDivQty.innerHTML = "0"};

            // Si quantité = 0, alors on supprime la vignette. Valable uniquement en dehors du panneau de recherche
            if (MyQty == 0 && IsSearch == false) {
                MyVignette.remove();
            };
        });
};

// Range tous les éléments d'un Div par ordre alphabétique selon leur id
function RangerDivPArOrdreAlphabetique(MyDiv) {
   
    // Variables permettant d'enregistrer les éléments dans le bon ordre
    let MyTabRange = [];
    let MyValue = "";
    let MyDivBis = "";

    // Variable pour savoir si le noeud a déjà été traité ou non
    let MyBool = false;
    
    // On veut chercher la valeur la plus petite autant de fois qu'il y a de valeurs
    for (i = 0; i < MyDiv.childNodes.length; i++) {
        
        // On met exprès une valeur qui sera forcément à la fin de la liste
        MyValue = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
        
        // Pour chaque valeur, on y compare avec les autres valeur
        for (j = 0; j < MyDiv.childNodes.length; j++) {
            
            MyBool = false;
            
            // Vérification de s'il a été déjà enregistré ou non
            for (k = 0; k < MyTabRange.length; k++){
                if(MyDiv.childNodes[j].id == MyTabRange[k]){MyBool = true};
            }

            // Si le nom se place avant celui qu'on compare alphabétiquement, et on écrase la valeur à chaque fois que ça arrive
            // Sauf si l'élément en question a déjà été rangé
            // de cette façon, on trouve le n ème plus petit à chaque boucle
            if (MyDiv.childNodes[j].id < MyValue && MyBool == false) {
                MyValue = MyDiv.childNodes[j].id;
            };
        };
        
        // On enregistre la valeur la plus petite dans le tableau au fur et à mesure, le tableau nous donnera la liste remise dans l'ordre
        MyTabRange.push(MyValue);

    };

    // On replace ensuite tous les éléments selon la liste MyTabRange
    // Pour chaque élément dans MyTabRange
    for (let n = 0; n < MyTabRange.length - 1; n++){

        // Parcours de chaque élément de MyDiv
        for (let m = 0; m < MyDiv.childNodes.length; m++){
            
            // Si le nom correspond, alors il faut le bouger au niveau de n, en le mettant donc avant n + 1
            if(MyDiv.childNodes[m].id == MyTabRange[n]){
                
                // Gestion du cas particulier où on essaye de mettre un élément devant lui-même
                //  -> Dans ce cas là, on l'insert devant l'élément d'avant (n)
                if(MyDiv.childNodes[n + 1].id == MyTabRange[n]){
                    MyDiv.insertBefore(MyDiv.childNodes[m], MyDiv.childNodes[n]);
                } else {
                    MyDiv.insertBefore(MyDiv.childNodes[m], MyDiv.childNodes[n + 1]);
                };
                
            };
        };
    };

};

// Indique si un élément avec un id MyName précis existe déjà dans MyDiv ou non
function ExisteDeja(MyName, MyDiv) {
    let MyBool = false;
    for(let i = 0; i < MyDiv.childNodes.length; i++){
        if (MyDiv.childNodes[i].length > 1) {
            MyBool = ExisteDeja(MyName, MyDiv.childNodes[i]);
        } else {
            if(MyDiv.childNodes[i].id == MyName){MyBool = true};
        };

        // Si MyBool = true, on a notre réponse, on doit sortir de la boucle au cas où la valeur ne soit écrasée par une autre
        // => Vraiment pas sûr qu'il y en ait besoin après réflexion.. On laisse pour l'instant, ça fait de mal à personne
        if (MyBool){break};
    };
    
    return(MyBool);
};

// Met à jour la liste de Cartes à afficher selon les types de cartes "ByType", selon les catégories "ByCat", selon la valeur de mane "ByMana"
function UpdateCardList() {
    
    // Récupération de la DeckList
    GetMyDeck()
        .then(MyDeck => {

            // Liste contenant tous les noms de type
            let MyTypeList = ["Creature", "Instant", "Sorcery", "Enchantment", "Land"];
            let MyTypeListFr = ["Créature", "Ephémère", "Rituel", "Enchantement", "Terrains"];

            // Parcours de toute la Decklist
            for (let i = 0; i < MyDeck.cardList.length; i++) {
                
                // 1ère étape, on détermine dans quel groupe doit attérir la carte

                // Déclaration de MyGroup qui correspondra soit à un groupe de Type, de Catégorie, ou de Mana
                let MyGroup = 0;

                // Cas d'un ordre "ByType"
                if (MyOrder == "ByType"){

                    // Pour la correspondance avec le fr
                    let n = -1;
                    
                    // Parcours de tous les types, et on voit s'il correspond à la carte en cours
                    MyTypeList.forEach(MyType => {

                        n++;
                        
                        // S'il le groupe du type de la carte en cours existe déjà, on l'attribue à MyGroup
                        if(MyDeck.cardList[i][0].type.indexOf(MyType) != -1 && ExisteDeja(MyTypeListFr[n], MyMainField)){
                            MyGroup = document.getElementById(MyTypeListFr[n]);
                        };
                        
                        // Sinon, il faut le créer
                        if(MyDeck.cardList[i][0].type.indexOf(MyType) != -1 && ExisteDeja(MyTypeListFr[n], MyMainField) == false){
                            MyGroup = CreationCategorie(MyTypeListFr[n]);
                            MyMainField.appendChild(MyGroup);
                        };
                    });  
                };

                // Cas d'un order "ByCat"
                if (MyOrder == "ByCat"){
                    
                    // S'il le groupe du type de la carte en cours existe déjà, on l'attribue à MyGroup
                    if(ExisteDeja(MyDeck.cardList[i][2], MyMainField)){
                        MyGroup = document.getElementById(MyDeck.cardList[i][2]);
                    } else {
                        MyGroup = CreationCategorie(MyDeck.cardList[i][2]);
                        MyMainField.appendChild(MyGroup);
                    };
                };

                // Cas d'un order "ByMana"
                if (MyOrder == "ByMana"){
                    
                    // S'il le groupe du type de la carte en cours existe déjà, on l'attribue à MyGroup
                    if(ExisteDeja("CMC : " + MyDeck.cardList[i][0].cmc, MyMainField)){
                        MyGroup = document.getElementById("CMC : " + MyDeck.cardList[i][0].cmc);
                    } else {
                        MyGroup = CreationCategorie("CMC : " + MyDeck.cardList[i][0].cmc);
                        MyMainField.appendChild(MyGroup);
                    };
                };

                // 2ème étape, on rajoute la carte dans le groupe, ou on l'a met à jour si elle existe déjà
                if (ExisteDeja(MyDeck.cardList[i][0].name, MyGroup)){
                    
                    let MyVignette = 0;
                    
                    // Recherche du div si ça existe déjà
                    for (let j = 0; j < MyGroup.childNodes.length; j++) {
                        if (MyGroup.childNodes[j].id == MyDeck.cardList[i][0].name){MyVignette = MyGroup.childNodes[j]}
                    };
                    
                    MajVignette(MyDeck.cardList[i][0], MyVignette, false);
                } else {
                    AjouterCarteDansGroupe(MyDeck.cardList[i][0], MyGroup, MyDeck.userId, MyDeck.cardList[i][1]);
                };

                // 3ème étape, on range par ordre aphabétique
                RangerDivPArOrdreAlphabetique(MyGroup);

            };

            RangerDivPArOrdreAlphabetique(MyMainField);

            // Si classement par catégorie, alors on fait apparaître également un autre groupe "Nouvelle Catégorie"
            //      => Le but est de faire glisser/déposer une carte dedans
            if (MyOrder == "ByCat") {
                if (ExisteDeja("Nouvelle Catégorie", MyMainField) == false){
                    MyMainField.appendChild(CreationCategorie("Nouvelle Catégorie"));
                };

                // On crée aussi la Catégorie Commandant, que l'on met en début de liste
                if (ExisteDeja("Commandant", MyMainField) == false){MyMainField.appendChild(CreationCategorie("Commandant"))};
                for (let i = 0; i < MyMainField.childNodes.length; i++) {
                    if(MyMainField.childNodes[i].id == "Commandant"){MyMainField.insertBefore(MyMainField.childNodes[i], MyMainField.childNodes[0])};
                };
            };
            
            TuilageCarte();
        })
        .catch(err => console.log(err));
};

// Création du groupe MyName
function CreationCategorie(MyName) {
    
    // Création du groupe s'appelant MyName, avec la classe "Groupe"
    let MyGroup = document.createElement("div");
    MyGroup.className = "Groupe";
    MyGroup.id = MyName;

    // Création du titre du groupe, visible à l'utilisateur
    // Si c'est classé par catégorie, on rajoute un titre avec un bouton option, qui fera apparaître un menu pour renommer la catégorie
    if(MyOrder == "ByCat"){
        
        // La div qui contiendra tout
        let MyTitle_Cat = document.createElement("div");
        MyTitle_Cat.className = "Titre_Groupe_Cat";

        // Div avec le titre
        let MyTitleName_Cat = document.createElement("div");
        MyTitleName_Cat.innerHTML = MyName;
        MyTitleName_Cat.className = "Titre_Groupe_Cat_Name"

        // Bouton Options
        let MyTitleOpt_Cat = document.createElement("div");
        MyTitleOpt_Cat.innerHTML = "▼";
        MyTitleOpt_Cat.className = "Titre_Groupe_Cat_Opt"

        // Div Menu
        let MyTitleMenu_Cat = document.createElement("div");
        MyTitleMenu_Cat.className = "Titre_Groupe_Cat_Menu";

        // Dans ce menu, il y aura :
        // Une barre pour renseigner du texte
        let MyTitleMenu_Barre = document.createElement("input");
        MyTitleMenu_Barre.type = "text";
        MyTitleMenu_Barre.innerHTML = "Nouveau titre";
        MyTitleMenu_Barre.className = "Titre_Groupe_Menu_Barre";
        MyTitleMenu_Cat.appendChild(MyTitleMenu_Barre);

        // Un bouton Renommer
        let MyTitleMenu_Btn_Renommer = document.createElement("div");
        MyTitleMenu_Btn_Renommer.innerHTML = "Renommer";
        MyTitleMenu_Btn_Renommer.className = "Titre_Groupe_Menu_Bouton Bouton_Renommer_Cat";
        MyTitleMenu_Cat.appendChild(MyTitleMenu_Btn_Renommer);

        // Un bouton Annuler
        let MyTitleMenu_Btn_Annuler = document.createElement("div");
        MyTitleMenu_Btn_Annuler.innerHTML = "Annuler";
        MyTitleMenu_Btn_Annuler.className = "Titre_Groupe_Menu_Bouton Bouton_Annuler_Cat";
        MyTitleMenu_Cat.appendChild(MyTitleMenu_Btn_Annuler);

        MyTitle_Cat.appendChild(MyTitleName_Cat);
        MyTitle_Cat.appendChild(MyTitleOpt_Cat);
        MyTitle_Cat.appendChild(MyTitleMenu_Cat);

        MyTitle_Cat.id = "1"
        MyGroup.appendChild(MyTitle_Cat);
    } else {
        let MyTitle = document.createElement("div");
        MyTitle.innerHTML = MyName;
        MyTitle.className = "Titre_Groupe";
        MyTitle.id = "1"
        MyGroup.appendChild(MyTitle);
    };

    // Message que l'on voit s'il n'y aucune carte, sinon il est caché par la carte
    let MyMessage = document.createElement("div");
    MyMessage.innerHTML = "Aucune carte dans ce groupe";
    MyMessage.className = "Message_Groupe";
    MyMessage.id = "2"
    MyGroup.appendChild(MyMessage);

    return MyGroup;

};

// Ajout de MyCard dans MyGroup
function AjouterCarteDansGroupe(MyCard, MyGroup, MyDeckUserId, MyQuantity) {
    let MyAjoutCarte = CreationVignetteCarte(MyCard, MyDeckUserId, MyQuantity, false);
    MyGroup.appendChild(MyAjoutCarte);
};

// Fonction pour positionner chaque carte dans un groupe en tuilage
function TuilageCarte() {
    
    // Parcours de tous les groupes
    for(let i = 0; i < MyMainField.childNodes.length; i++) {
        
        // Pour ne compter que les div avec la classe qui nous intéresse
        let k = -1;
        
        // Parcours de tous les éléments à l'intérieur du groupe
        for(let j = 0; j < MyMainField.childNodes[i].childNodes.length; j++) {
            
            // S'il s'agit d'une vignette, on y repositionne en cascade
            if(MyMainField.childNodes[i].className.indexOf("Groupe") !== -1 && MyMainField.childNodes[i].childNodes[j].className.indexOf("Vignette_Carte") !== -1) {
                k++;
                MyMainField.childNodes[i].childNodes[j].style.top = 36 + k * 33 + "px";
            };
            
            // On adapte la taille du groupe au nombre de carte qu'il y a dedans
            // Cas particulier : on veut la même taille quand il y a 0 ou 1 carte
            let MyValue = "";
            if(k == -1){MyValue = "331px"}else{MyValue = 331 + k * 33 + "px"};

            if(MyMainField.childNodes[i].className.indexOf("Groupe") !== -1){MyMainField.childNodes[i].style.height = MyValue};
        }
    };
};

// Fonction glisser déposer
// Si on est en classement par catégorie, alors il est possible de passer une carte d'un groupe à un autre grâce à un glisser/déposer
// Il ne se lancera au moment où on reste appuyer sur une carte

MyMainField.addEventListener("mousedown", event => {

    GetMyDeck()
            .then(MyDeck => {

        // Ne marche que si on clique sur l'image
        if(event.target.className.indexOf("Img_Carte") !== -1 && MyOrder == "ByCat"){

            // On clone l'image pour ne pas toucher la vignette
            // -> On aurait aimer bouger tout l'ensemble, mais ça rame trop
            let MyImg = event.target.cloneNode(true);

            // On récupère quand même Vignette et Groupe au cas où
            let MyVignette = event.target.parentNode;
            let MyOldGroup = MyVignette.parentNode;
            let MyNewGroup = MyOldGroup;
            let MyCard = [];

            // On vérifie si la carte est légendaire ou pas
            let MyLegend = false;
            for(let i = 0; i < MyDeck.cardList.length; i++){
                if(MyVignette.id == MyDeck.cardList[i][0].name) {
                    if(MyDeck.cardList[i][0].type.indexOf("Legendary Creature") != -1){MyLegend = true};
                    MyCard = MyDeck.cardList[i][0];
                };
            };

            // On cache la vignette pour faire genre qu'on déplace l'élément
            MyMainField.appendChild(MyVignette);
            MyVignette.style.visibility = "hidden";
            //for (let i = 0; i < MyVignette.childNodes.length; i++) {MyVignette.childNodes[i].style.visibility = "false"};

            // On met l'image dans MyMainField avec position absolute pour lui attribuer la position que l'on veut dans l'espace
            MyMainField.appendChild(MyImg);
            MyImg.style.position = "absolute";

            // Positionné direct là où est la souris pour que ça soir transparent pour l'utilisateur et qu'il n'y ait pas de "saut" en position 0
            MyImg.style.left = event.pageX + 5 + "px";
            MyImg.style.top = event.pageY + 5 + "px";

            // Dès que la souris bouge, l'image suit
            // -> On a été obligé de faire un événement dans l'événement pour que cela marche
            MyMainField.addEventListener("mousemove", onMouseMove);

            function onMouseMove(event) {

                let MyX = event.pageX;
                let MyY = event.pageY;
                
                // Obligé de faire "dépasser" la souris de la carte quand on la déplace, pour être sûr où est ce qu'on la place ensuite (event.target)
                MyImg.style.left = MyX + 5 + "px";
                MyImg.style.top = MyY + 5 + "px";

                // Parcours de tous les groupes pour le style
                for (let i = 0; i < MyMainField.childNodes.length; i++) {
                    
                    let MyNode = MyMainField.childNodes[i];
                    if (MyNode.className.indexOf("Groupe") !== -1) {
                        if(MyX > MyNode.offsetLeft && MyX < MyNode.offsetLeft + MyNode.offsetWidth && MyY > MyNode.offsetTop && MyY < MyNode.offsetTop + MyNode.offsetHeight){
                            MyNode.style.background = "rgb(255, 255, 255)";
                            MyNode.style.boxShadow = "1px 1px 20px rgb(50, 50, 50)";
                            MyNewGroup = MyNode;
                            break;
        
                        } else {
                            MyNode.style.background = "rgb(50, 50, 70, 0.5)";
                            MyNode.style.boxShadow = "none";
                            MyNewGroup = MyOldGroup;
                        };
                    };
                };
            };

            // Dès que le clique de la souris se relève
            MyMainField.onmouseup = function() {
                
                // Suppression de l'évenement mousemove
                MyMainField.removeEventListener("mousemove", onMouseMove);

                //Suppression de l'image
                MyImg.remove();


                // Pour le groupe Commandant, carte acceptée uniquement si elle est légendaire et s'il n'y en a qu'une dans le groupe sinon retour à l'ancien groupe
                if(MyNewGroup.id == "Commandant" && MyLegend == false) {MyNewGroup = MyOldGroup};
                if(MyNewGroup.id == "Commandant" && MyLegend && MyNewGroup.childNodes.length > 2) {MyNewGroup = MyOldGroup};

                // Integration de MyVignette dans son nouveau groupe
                MyNewGroup.appendChild(MyVignette);
                MyVignette.style.visibility = "visible";

                // Définition du commandant selon ce qu'il y a dans la catégorie Commandant
                // S'il un commandant est renseigné, on met à jour, peu importe si c'est le même
                if(MyMainField.childNodes[0].childNodes.length > 2) {
                    DefinirCommandant(MyCard);
                
                    // Sinon on y supprime
                } else {
                    SupprCommander();
                };

                // S'il on l'a utilisé, changement du nom de "Nouvelle Catégorie", qu'il faut recréer
                if(MyNewGroup.id == "Nouvelle Catégorie") {

                    // On change simplement le nom en rajoutant un chiffre qu'on incrémente s'il en existe d'autres qu'on a pas renommé
                    let x = 0;

                    for(y = 0; y < MyMainField.childNodes.length; y++) {
                        if(MyMainField.childNodes[y].id.indexOf("Nouvelle Catégorie (") != -1){

                            // On retire "Nouvelle Catégorie (" et ")" du titre pour de garder que le chiffre
                            let q = Number(MyMainField.childNodes[y].id.replace("Nouvelle Catégorie (", "").replace(")", ""));
                            if(q > x){x = q};
                        }
                    };

                    x++;

                    MyNewGroup.id = "Nouvelle Catégorie (" + x + ")";
                    MyNewGroup.childNodes[0].childNodes[0].innerHTML = "Nouvelle Catégorie (" + x + ")";

                    // Création d'un nouveau Groupe "Nouvelle Catégorie"
                    MyMainField.appendChild(CreationCategorie("Nouvelle Catégorie"));

                };

                // Suppression des catégories vide (sauf Nouvelle Catégorie et Commandant)
                for(z = 0; z < MyMainField.childNodes.length; z++) {
                    if(MyMainField.childNodes[z].className.indexOf("Groupe") != -1 && MyMainField.childNodes[z].id != "Nouvelle Catégorie" && MyMainField.childNodes[z].id != "Commandant" && MyMainField.childNodes[z].childNodes.length < 3){
                        MyMainField.childNodes[z].remove();
                    };
                };
                
                // On remet tous les groupes à la bonne couleur et on tri tout par ordre alphabétique
                for (let i = 0; i < MyMainField.childNodes.length; i++) {
                    MyMainField.childNodes[i].style.background = "rgb(50, 50, 70, 0.5)";
                    MyMainField.childNodes[i].style.boxShadow = "none";
                };

                // On change la Catégorie de la vignette
                ChangerCategorie(MyVignette, MyNewGroup.id);

                RangerDivPArOrdreAlphabetique(MyNewGroup);

                TuilageCarte();

                MyMainField.onmouseup = null;

            };
        };
    });
});

// Gestion du menu des groupes, et de ces boutons
MyMainField.addEventListener("click", event => {

    // Apparition du menu
    // On ne le fait pas apparaître pour Nouvelle Catégorie car unique, qu'on veut pas modifier
    if(event.target.className == "Titre_Groupe_Cat_Opt" && event.target.parentNode.parentNode.id != "Nouvelle Catégorie") {
        
        let MyOpt = event.target;
        
        // On fait descendre ou monter le menu
        if(MyOpt.innerHTML == "▼"){
            MyOpt.parentNode.childNodes[2].style.top = "50px";
            MyOpt.innerHTML = "▲";
        } else {
            MyOpt.parentNode.childNodes[2].style.top = "-100px";
            MyOpt.innerHTML = "▼";
        };
    };

    // Gestion du bouton Renommer
    if(event.target.className.indexOf("Bouton_Renommer_Cat") != -1) {
        
        let MyMenu = event.target.parentNode;
        let MyGroup = MyMenu.parentNode.parentNode;
        // Vérification que le nom est correct

        // On ne veut pas qu'il soit vide
        if(MyMenu.childNodes[0].value == ""){
            alert("Le nom d'une catégorie ne peut être vide.")
        } else {

            // On ne veut pas non plus utiliser un nom déjà existant
            let MyBool = false;
            for(let i = 0; i < MyMainField.childNodes.length; i++) {
                if (MyMenu.childNodes[0].value == MyMainField.childNodes[i].id){MyBool = true};
            };

            if (MyBool) {
                alert ("Nom déjà existant");
            } else {

                // Une fois que tout cela est vérifié, on peut renommer tranquillement
                MyMenu.parentNode.childNodes[0].innerHTML = MyMenu.childNodes[0].value;
                MyGroup.id = MyMenu.childNodes[0].value;
                MyMenu.style.top = "-100px";
                MyMenu.parentNode.childNodes[1].innerHTML = "▼";

                // Une fois renommé, il faut enregistrer cela dans la bdd
                // => Toutes les cartes du groupe doivent avoir cette nouvelle catégorie renseignée dans la bdd
                console.log(MyGroup);
                for (let i = 2; i < MyGroup.childNodes.length; i++){ // i commence à 2 pour ignorer les 2 premiers éléments, qui ne sont pas des cartes
                    ChangerCategorie(MyGroup.childNodes[i], MyGroup.id);
                };
            };

        };

    };

    // Gestion du bouton Annuler
    if(event.target.className.indexOf("Bouton_Annuler_Cat") != -1) {
        event.target.parentNode.style.top = "-100px";
        event.target.parentNode.parentNode.childNodes[1].innerHTML = "▼";
    };

    // Sinon on clique ailleurs, on remonte tout
    if(event.target.className != "Titre_Groupe_Cat_Opt" && event.target.className != "Titre_Groupe_Cat_Menu" && event.target.parentNode.className != "Titre_Groupe_Cat_Menu") {
        for(let i = 0; i < MyMainField.childNodes.length; i++) {
            MyMainField.childNodes[i].childNodes[0].childNodes[2].style.top = "-100px";
            MyMainField.childNodes[i].childNodes[0].childNodes[1].innerHTML = "▼";
        };
    };
});

// Changer la catégorie de la carte de MyVignette
async function ChangerCategorie(MyVignette, MyNewCat) {
    // await response of fetch call
    let response = await fetch("http://localhost:3000/api/deck/changeCategory", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: sessionStorage.getItem('idUser'),
            deckId: sessionStorage.getItem('DeckId'),
            card: MyVignette.id,
            name: MyNewCat
        })
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

// Va chercher la DeckList
async function GetMyDeck() {
    // await response of fetch call
    let response = await fetch('http://localhost:3000/api/deck/getMyDeck?deckId=' + sessionStorage.getItem('DeckId'), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

// Ajoute une carte au deck
async function AjoutCarteADeckList(MyCard, MyCat) {
    // await response of fetch call
    let response = await fetch("http://localhost:3000/api/deck/addCard", {
        method: "POST",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId : sessionStorage.getItem('idUser'),
            deckId : sessionStorage.getItem('DeckId'),
            card : MyCard,
            category: MyCat
            })
        })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
  }

// Supprime une carte du deck
async function RetirerCarteDeDeckList(MyCard) {
    // await response of fetch call
    let response = await fetch("http://localhost:3000/api/deck/deleteCard", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: sessionStorage.getItem('idUser'),
            deckId: sessionStorage.getItem('DeckId'),
            card: MyCard
        })
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

// Définit un Commandant => Ecrase tout avec nouvelle infos
async function DefinirCommandant(MyCard) {
    // await response of fetch call
    let response = await fetch("http://localhost:3000/api/deck/defineCommander", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: sessionStorage.getItem('idUser'),
            deckId: sessionStorage.getItem('DeckId'),
            card: MyCard
        })
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

// Va chercher l'info de quelle carte est commandant
async function GetMyCommander() {
    // await response of fetch call
    let response = await fetch('http://localhost:3000/api/deck/getCommander?deckId=' + sessionStorage.getItem('DeckId'), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

// Supprime le Commandant
async function SupprCommander() {
    // await response of fetch call
    let response = await fetch("http://localhost:3000/api/deck/deleteCommander", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: sessionStorage.getItem('idUser'),
            deckId: sessionStorage.getItem('DeckId'),
        })
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}