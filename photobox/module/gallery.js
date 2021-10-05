import { load } from "./photoloader.js";
import { afficherLightbox } from "./lightbox.js";
import { paginate } from "./pagination.js";

let gallery = document.querySelector("#photobox-gallery");
let currentMax;
let currentMin;

export function loadG() {
  //on récupère le tableau sous format JSON
  load("/photos").then(json => editDom(json));
  //on load -> on affiche les 15 premières entrées.
  currentMin = 0
  currentMax = 15

}

export function editDom(tabl) {
  //334 pages pour 15 par page
  console.log(paginate(5000));
  tabl.data.slice(currentMin,currentMax).forEach((e) => {
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

    //push dans la galerie
    gallery.appendChild(div);
  });
}
