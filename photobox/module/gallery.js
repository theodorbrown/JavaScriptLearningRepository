import { load } from "./photoloader.js";
import { afficherLightbox } from "./lightbox.js";

let gallery = document.querySelector("#photobox-gallery");
let currentMax;
let currentMin;
let container = document.createElement("div");
    container.setAttribute("id", "container-vig-load");
    container.setAttribute("class", "gallery-container");
//init container vide
gallery.appendChild(container);

export let jsonData;

export function loadG() {
  //on récupère le tableau sous format JSON
  load("/photos").then(json => {
    editDom(json);
    jsonData = json;
  })
  //on load -> on affiche les 15 premières entrées.
  currentMin = 0
  currentMax = 15
}

export function editDom(tabl) {
  //suppresion du contenu de la galerie à chaque load
  document.getElementById("container-vig-load").innerHTML = ""
  
  //334 pages pour 15 par page
  tabl.data.slice(currentMin,currentMax).forEach((e) => {

    //div d'une vignette complete sur la galerie
    let div = document.createElement("div");
    //class="vignette"
    div.setAttribute("class", "vignette");   //target renvoie la balise complete de l'élément, son objet dans le DOM
    div.addEventListener("click", () => afficherLightbox(e));

    let img = document.createElement("img");
    img.setAttribute(
      "src",
      e.thumbnailUrl
    );
    img.setAttribute("id", e.id);
    img.setAttribute("titre", e.title);

    let p = document.createElement("p");
    p.appendChild(document.createTextNode(e.title));

    //push dans le div père
    div.appendChild(img);
    div.appendChild(p);

    container.appendChild(div)
    //push dans la galerie
    
  });
  gallery.appendChild(container);
}

function paginateur(elementId){
  if (elementId == "previous") {
    if (currentMin == 0) {
      alert("Pas de page précédente");
    } else {
      currentMin-=15;
      currentMax-=15;
      editDom(jsonData);
    }
  } else if (elementId == "next") {
    if (currentMax == 5000) {
      alert("Pas de page suivante");
    } else {
      currentMin+=15;
      currentMax+=15;
      editDom(jsonData);
    }
  } else {
    alert("erreur non identifiée");
  }
}

export function controlPages() {
  document.getElementById("previous").addEventListener("click", (e) => paginateur(e.target.id));
  document.getElementById("next").addEventListener("click", (e) => paginateur(e.target.id));
}
