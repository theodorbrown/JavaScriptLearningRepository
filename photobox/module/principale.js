import { loadG } from "./gallery.js";

window.onload = () => {
  const btn = document.getElementById("load_gallery");
  btn.addEventListener("click", loadG);
};
