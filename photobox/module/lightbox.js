import { jsonData } from "./gallery.js";

let elementCourantId;

export function afficherLightbox(element) {
  elementCourantId = element.id;

  const gallery = document.querySelector("#photobox-gallery");

  const lightbox = document.createElement("div");
  lightbox.innerHTML = `
    <div class="lightbox_container bg-secondary" id="lightbox_container">
        <div id="lightbox">
            <div id="lightbox-head">
                <button type="button" class="close" id="lightbox_close" aria-label="Close">
                    <span aria-hidden="true">&Chi;</span>
                </button>
                <h1 id="lightbox_title" class="text-center bg-dark">${element.title}</h1>
            </div>

            <div id="lightbox-img">
                <img id="lightbox_full_img" src="${element.url}" style="width:450px;height:300px;">
            </div>
            <div class="row">
            <div class="col text-center p-2">
            <button id="prev" type="button" class="btn btn-warning">Précédent</button>
            </div>
            <div class="col text-center p-2">
            <button id="nxt" type="button" class="btn btn-warning">Suivant</button>
            </div>
            </div>

            <div class="p-2">
                <h3 class="text-center">Description</h3>
                <p class="text-center">Id : ${element.id}</p>
                <p class="text-center">AlbumId : ${element.albumId}</p>
                <p class="text-center">Url : ${element.url}</p>
                <p class="text-center">Titre : ${element.title}</p>
            </div>
        </div>
    </div>`;

  gallery.appendChild(lightbox);

  gallery.querySelector("#lightbox_close").addEventListener("click", enleverLightbox);

  document.querySelector("#prev").addEventListener("click", () => reload("prev"));
  document.querySelector("#nxt").addEventListener("click", () => reload("next"));
}

function enleverLightbox() {
  document.getElementById("lightbox_container").remove();
}

function reload(string){
  changerImage(jsonData, string);
}

function changerImage(json, string) {
  //On enlève la lightbox courante, pour vider le DOM.
  enleverLightbox();

  //élément courant
  let res = json.data.filter(element => element.id == elementCourantId);
  
  if (string == "next") {
    if (elementCourantId == 5000) {
      alert("Pas d'élément suivant");
    } else {
      let nextelement = json.data.filter(element => element.id == (res[0].id)+1)
      var elementToLoad1 = nextelement[0];
      //on édite le DOM
      afficherLightbox(elementToLoad1);
    }
  } else if (string == "prev"){
    if (elementCourantId == 1) {
      alert("Pas d'élément précédent");
    } else {
      let prevelement = json.data.filter(element => element.id == (res[0].id)-1)
      var elementToLoad2 = prevelement[0];
      afficherLightbox(elementToLoad2);
    }
  }
}
