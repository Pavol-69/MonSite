const MyButtonSignUp = document.getElementById("MonBoutonInscription");

const MyPseudoSignUp = document.getElementById("MonPseudoInscription");
const MyPasswordSignUp = document.getElementById("MonMdpInscription");

MyButtonSignUp.addEventListener("click", function () {
    UserSignUp()
        .then(MyUser => {
                sessionStorage.clear();
                sessionStorage.setItem('idUser', MyUser.userId);
                sessionStorage.setItem('token', MyUser.token);
                sessionStorage.setItem('pseudo', MyPseudoSignUp.value);
                window.location.href="Page_Principale.html";
             })
        .catch(err => console.log(err))
});

async function UserSignUp () {
    // await response of fetch call
    let response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pseudo : MyPseudoSignUp.value,
            password : MyPasswordSignUp.value,
            })
        })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
  }