import { loadG } from "./gallery.js";
import { controlPages } from "./gallery.js"

window.onload = () => {
  document.getElementById("load_gallery").addEventListener("click", loadG);
  controlPages();
};
