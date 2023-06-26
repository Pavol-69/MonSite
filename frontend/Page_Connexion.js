const MyButtonLogIn = document.getElementById("MonBoutonConnexion");

const MyPseudoLogIn = document.getElementById("MonPseudoConnexion");
const MyPasswordLogIn = document.getElementById("MonMdpConnexion");

MyButtonLogIn.addEventListener("click", function () {
    UserLogIn()
        .then(MyUser => {
                console.log(MyUser);
                if (MyUser.error != "Utilisateur non trouvé !" && MyUser.error != "Mot de passe incorrect !") {
                    sessionStorage.clear();
                    sessionStorage.setItem('idUser', MyUser.userId);
                    sessionStorage.setItem('token', MyUser.token);
                    sessionStorage.setItem('pseudo', MyPseudoLogIn.value);
                    window.location.href="Page_Principale.html";
                } else {
                    alert(MyUser.error);
                };
             })
        .catch(err => console.log(err))
});

async function UserLogIn () {
    // await response of fetch call
    let response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pseudo : MyPseudoLogIn.value,
            password : MyPasswordLogIn.value,
            })
        })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
  }