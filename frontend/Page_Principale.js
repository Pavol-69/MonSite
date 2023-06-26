let MyPseudo = sessionStorage.getItem('pseudo');
const MyMessage = document.getElementById("MesInfosUtilisateur");
const MyConnexionButton = document.getElementById("MonBoutonConnexion");
const MyInscriptionButton = document.getElementById("MonBoutonInscription");
const MyDeconnectButton = document.getElementById("MonBoutonDeconnexion");
const MyNewDeckButton = document.getElementById("MonBoutonNouveauDeck");
const MyDivNewDeck = document.getElementById("DivNouveauDeck");
const MyCreateButton = document.getElementById("MonBoutonCreer");
const MyDecksList = document.getElementById("MesDecks");
const MyAllDecks = document.getElementById("TousLesDecks");
const MyDeckName = document.getElementById("BarreNomNouveauDeck");
const MyBody = document.getElementById("MonBody");
const MyButtons = document.getElementById("Boutons_Connexion");
const MyInfos = document.getElementById("Utilisateur_Connecte");

// Cache le menu Nouveau Deck quand on clique ailleurs
MyBody.addEventListener('click', function (){
    const MyElt = document.querySelectorAll("#DivNouveauDeck:hover");
    const MyElt2 = document.querySelectorAll("input:hover");
    if(MyElt.length==0 && MyElt2.length==0){
        MyDivNewDeck.style.visibility = 'hidden';
    };
});

// Affichage ou non de certains éléments selon si on est connecté ou pas
if(sessionStorage.getItem('pseudo') != null){
    MyConnected();
}else{
    MyDisconnected();
};

AfficherTousLesDecks();
AfficherTousMesDecks();

MyDeconnectButton.addEventListener('click', function() {
    MyDisconnected();
});

// Les éléments que l'on affiche et cache quand on est connecté
function MyConnected(){
    MyMessage.innerHTML = "Connecté en tant que " + MyPseudo;
    MyConnexionButton.style.visibility = 'hidden';
    MyInscriptionButton.style.visibility = 'hidden';
    MyButtons.style.zIndex = 0;
    MyDeconnectButton.style.visibility = 'visible';
    MyInfos.style.zIndex = 1;
    MyNewDeckButton.style.visibility = 'visible';
    MyDecksList.style.visibility = 'visible';
    MyAllDecks.style.visibility = 'visible';
    MyDivNewDeck.style.visibility = "hidden";
};

// Les éléments que l'on affiche et cache quand on est déconnecté
function MyDisconnected(){
    MyMessage.innerHTML = "";
    MyConnexionButton.style.visibility = 'visible';
    MyInscriptionButton.style.visibility = 'visible';
    MyButtons.style.zIndex = 1;
    MyDeconnectButton.style.visibility = 'hidden';
    MyInfos.style.zIndex = 0;
    MyNewDeckButton.style.visibility = 'hidden';
    MyDecksList.style.display = "none";
    MyAllDecks.style.visibility = 'visible';
    MyDivNewDeck.style.visibility = "hidden";
    sessionStorage.clear;
    sessionStorage.removeItem('DeckId');
    sessionStorage.removeItem('DeckName');
    sessionStorage.removeItem('idUser');
    sessionStorage.removeItem('pseudo');
    sessionStorage.removeItem('token');
};

// Création d'un nouveau deck => Affichage du menu dédié
MyNewDeckButton.addEventListener('click', function () {
    MyDivNewDeck.style.visibility = "visible";
});

// Demande de création d'un nouveau deck
MyCreateButton.addEventListener('click', function() {
    if(MyDeckName.value != ""){
        if(MyPseudo!=null){
            CreateDeck();
        };
    }else{
        alert("Veuillez renseigner un nom de deck");
    };
});

// Fonction création d'un nouveau que l'on ajoute à la BDD
function CreateDeck(){
    
        fetch("http://localhost:3000/api/deck/createDeck", {
            method: "POST",
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId : sessionStorage.getItem('idUser'),
                name : MyDeckName.value,
                })
            })

            .then(res => {
                let i = res.status;
                if(i<=299){
                    res.json().then(data => {
                        sessionStorage.setItem('DeckName', MyDeckName.value);
                        sessionStorage.setItem('DeckId', data._id);
                        console.log("deck créé");
                        window.location.href="Page_Deck.html"
                    });
                }else{
                    console.log(res);
                };
                
            })
    
};

// Affichage de tous les decks, ceux de l'utilisateur, et ceux de la communauté
function AfficherTousLesDecks(){
    MyAllDecks.innerHTML = "";
    GetAllDecks()
    .then(MyDecks => {
        let MyTab = MyDecks; // Tri naturellement par l'ordre de création
        let n = 0;
        let MyBool = true;
        for(let i = 0; i < MyTab.length;i++){
            n++;
            // On permet de supprimer le deck seulement s'il appartient à l'utilisateur connecté, sinon le bouton supprimé n'apparait pas
            if(MyTab[i].userId == sessionStorage.getItem('idUser')){MyBool = true}else{MyBool = false};
            CreerVignetteDeck(MyAllDecks, MyTab[i], MyBool);
        };
        if(n==0){
            const MyDivMessage = document.createElement("div");
            MyDivMessage.innerText = "Aucun deck n'a encore été créé par la communauté"
            MyDivMessage.className = "Message_Vide";
            MyDecksList.appendChild(MyDivMessage);
        };
    })
    .catch(err => console.log(err))

};

// Affichage de tous les decks de l'utilisateur dans une liste dédiée
function AfficherTousMesDecks(){
    MyDecksList.innerHTML = "";
    GetAllDecks()
    .then(MyDecks => {
        let n = 0;
        let MyTab = MyDecks; // Tri naturellement par l'ordre de création
        for(let i = 0; i < MyTab.length;i++){
            if(MyTab[i].userId == sessionStorage.getItem('idUser')){
                n++;
                CreerVignetteDeck(MyDecksList, MyTab[i], true);
            }
        };
        if(n==0){
            const MyDivMessage = document.createElement("div");
            MyDivMessage.innerText = "Vous n'avez encore créé aucun deck"
            MyDivMessage.className = "Message_Vide";
            MyDecksList.appendChild(MyDivMessage);
        };
    })
    .catch(err => console.log(err))

}

// Création d'une vignette de deck, avec titre du deck, image carte principale, boutons ouvrir et (ou non) supprimer
function CreerVignetteDeck(MyConteneur, MyList, BoutonSuppr) {
    const MyDiv = document.createElement("div");
    const MyDivImg = document.createElement("div");
    const MyImg = document.createElement("img");
    const MyName = document.createElement("div");
    const MyOuvrir = document.createElement("div");
    const MySuppr = document.createElement("div");
    const MyDivPackage = document.createElement("div");
    MyDivPackage.className = "MyDivPackage";
    MyDiv.className = "Class_Deck";
    if(MyList.commander.length>0){
        MyImg.src = MyList.commander[0].imageUrl;
    }else{
        MyImg.src = "https://www.smfcorp.net/images/dos_carte.png";
    }
    MyDiv.id = MyList._id;
    MyDivImg.className = "Div_Img_Deck";
    MyImg.className = "Img_Deck";
    MyName.className = "Nom_Deck";
    MyName.textContent = MyList.name;
    MySuppr.textContent = "Supprimer";
    MyOuvrir.textContent = "Ouvrir";
    MyConteneur.appendChild(MyDiv);
    MyDivImg.appendChild(MyImg);
    MyDiv.appendChild(MyDivImg);
    MyDivPackage.appendChild(MyName);
    MyDivPackage.appendChild(MyOuvrir);
    MyDiv.appendChild(MyDivPackage);
    MyOuvrir.id = MyList._id
    MyOuvrir.addEventListener('click', function() {
        sessionStorage.setItem('DeckName', MyName.innerText);
        sessionStorage.setItem('DeckId', MyOuvrir.id);
        window.location.href="Page_Deck.html"
    });
    if(BoutonSuppr){
        MySuppr.className = "Bouton_Deck";
        MyDivPackage.appendChild(MySuppr);
        MyOuvrir.className = "Format_2_Boutons_Ouvrir"
        MySuppr.className = "Format_2_Boutons_Suppr"
        MySuppr.id = MyList._id
        MySuppr.addEventListener('click', function() {
            SupprimerDeck(MySuppr.id)
            .then(MyListDeck => {
                AfficherTousMesDecks();
                AfficherTousLesDecks();
            })
            .catch(err => console.log(err))
        });
    } else {
        MyOuvrir.className = "Format_1_Bouton_Ouvrir"
    };
    
};

// Va chercher tous les decks dans la BDD, et les enregistre dans une liste
async function GetAllDecks () {
    // await response of fetch call
    let response = await fetch('http://localhost:3000/api/deck/getAllDecks', {
        method: "GET",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

async function SupprimerDeck(DeckId) {
    // await response of fetch call
    console.log(DeckId)
    let response = await fetch("http://localhost:3000/api/deck/deleteDeck", {
        method: "DELETE",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId : sessionStorage.getItem('idUser'),
            deckId : DeckId,
            })
        })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
  }

  async function SupprimerAllDecks() {
    // await response of fetch call
    let response = await fetch("http://localhost:3000/api/deck/deleteAllDecks", {
        method: "DELETE",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
  }