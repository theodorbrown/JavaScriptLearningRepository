//constructeur de notes
function Note(t,c) {
	this.titre = t;
	this.contenu= c;
	this.date_creation = new Date();
	//id unique
	this.id = Date.now();
}
//vue du formulaire
let noteFormView = {

	isEdit: false,

	display(){
		//suppression de la classe create_edit_note-hidden pour afficher l'éditeur
		document.querySelector("#noteForm").classList.remove('create_edit_note-hidden');
	},

	hide(){
		//on met la classe pour masquer l'éditeur
		document.querySelector("#noteForm").classList.add('create_edit_note-hidden');
	},
	//initialisation d'une nouvelle note +
	validate(){
		//on met dans t la valeur du titre
		let t = document.querySelector('#form_add_note_title').value;
		//on met dans c la valeur du contenu
		let c = document.querySelector('#form_add_note_text').value;

		if (noteFormView.isEdit){
			let note = noteList.list.filter(e => e.id == noteListView.note.id);
			note[0].titre = t;
			note[0].contenu = c;
			//update date
			note[0].date_creation = new Date();
			noteFormView.isEdit = false;
		} else {
			let n = new Note(t,c);
			//ajoute la note au tableau
			noteList.add(n);
		}


		//save to localstorage
		noteList.save();
		//vide la section et load le tableau avec les infos à jour
		noteList.load();
		//hide le formulaire
		noteFormView.hide();
	},
	edit(){
		if(noteListView.note != null){
			noteFormView.isEdit = true;
			noteFormView.display();
			document.querySelector('#form_add_note_title').value = noteListView.note.titre;
			document.querySelector('#form_add_note_text').value = noteListView.note.contenu;
		} else {
			alert("Cliquez sur une note pour valider un choix");
		}
	},
}
//vue du contenu du note (container du milieu)
let noteView = {
	//méthode de conversion pour l'afficher convenablement
	convertir(note){
		let markdownText = `# ${note.titre}
							${note.date_creation.toLocaleString()}
							${note.contenu}`
		//converteur							
		let conv = new showdown.Converter();
		//format HTML
		let htmlText = conv.makeHtml(markdownText);
		
		return htmlText;
	},
	//afficher le contenu d'une note
	afficher(note){
		document.querySelector("#currentNoteView").innerHTML = this.convertir(note);
	},
	//cacher le contenu d'une note (utilisé dans le boutton add) par exemple
	hide(){
		document.querySelector('#currentNoteView').innerHTML = '';
	}
}

let noteList = {
	//propriété de l'objet, pas une variable
	list : [],

	add(note){
		noteList.list.push(note);
	},

	save(){
		//on enleve l'ancienne liste a chaque save
		localStorage.removeItem('listNotes');
		//on set le contenu à la liste actuelle
		localStorage.setItem('listNotes', JSON.stringify(noteList.list));
	},
	//load la data et permet de faire les display lors de l'init mais aussi 
	load(){
		//get data from localstorage
		let data = JSON.parse(localStorage.getItem('listNotes'));
		if(data){
			noteList.list = data;
		}
		//vide la section
		document.getElementById("noteListView").innerHTML = ""
		if (noteList.list) {
			noteList.list.forEach((e) => {
				noteView.afficher(e); 
				//affiche le titre de la note dans le bloc gauche
				noteListView.displayItem(e);
			});
		}
		//Vider le titre et le contenu
		document.querySelector('#form_add_note_title').value = "";
		document.querySelector('#form_add_note_text').value = "";
	},

	delete(){
		//noteListView.note.id
		if(noteListView.note != null){
		let filtered = noteList.list.filter((e) => e.id != noteListView.note.id);
		//on ecrase le tableau par le nouveau filtré
		noteList.list = filtered;

		//save to localstorage
		noteList.save();
		//vide la section et load le tableau avec les infos à jour
		noteList.load();

		} else {
			alert("Cliquez sur une note pour valider un choix");
		}
	}		
}

let noteListView = {
		
	currentNodeNote : null,
	note: null,
		
    displayItem(note) {
    	let tmpHtml = document.createElement('div');
    	tmpHtml.classList.add('note_list_item');
    	tmpHtml.innerHTML = note.titre;

		//seleciton de la note courante (surbrillance avec une classe)
		this.selectCurrentNote(tmpHtml);

		//target l'element en lui même (ici l'élément du DOM)
		tmpHtml.addEventListener("click", (e) => {
			this.selectCurrentNote(e.target, note);
			noteView.afficher(note);
			noteFormView.hide();
		});

		//push dans le DOM
		document.querySelector('#noteListView').appendChild(tmpHtml);
    },

    selectCurrentNote(nodeNote, note){

		if(this.currentNodeNote != nodeNote) {
			nodeNote.classList.add('note_list_item-selected'); 
			if (this.currentNodeNote != null) {
				this.currentNodeNote.classList.remove('note_list_item-selected');
			}
		}
		this.currentNodeNote = nodeNote;
		this.note = note;
    }
}

let mainMenuView = {

	init(){
		//bouton plus
		document.querySelector("#add").addEventListener("click", () => {
			noteFormView.display();//()car on a déclaré une fonction
			noteView.hide();
		});
		//bouton valider
		document.querySelector("#form_add_note_valid").addEventListener("click",noteFormView.validate);
		//bouton edit
		document.querySelector('#edit').addEventListener("click",noteFormView.edit);
		//bouton supprimer
		document.querySelector('#del').addEventListener("click",noteList.delete);
		//charge le local storage
		noteList.load();
	}
}	

 //on appel la méthode pour générer le tout
window.onload = mainMenuView.init;