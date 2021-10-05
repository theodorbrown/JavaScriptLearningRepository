//constructeur de notes
function Note(t,c) {
	this.titre = t;
	this.contenu= c;
	this.date_creation = new Date();
	
	function setTitre(t){
		this.titre = t;
	}
	
	function setContenu(c){
		this.contenu = c;
	}
}
//vue du formulaire
let noteFormView = {
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
			let n = new Note(t,c);

			//hide le formulaire
			noteFormView.hide();

			//a voir
			noteView.afficher(n); 
			noteListView.displayItem(n);
		},
		edit(){
			//TODO
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
		//cacher le contenu d'une note (utilisé dans le delete)
		hide(){
			document.querySelector('#currentNoteView').innerHTML = '';
		}
}

let noteList = {
	//propriété de l'objet, pas une variable
	list : [],
		
	addNote(note){		
		//noteListView.displayItem(note);
		let indice = list.push(note);
		noteList.save();
		return indice;
		},

	get(n){
		return list[n];
	},
	
	save(){
		//on enleve l'ancienne liste a chaque save
		localStorage.removeItem('listNotes');
		//on set le contenu à la liste actuelle
		localStorage.setItem('listNotes', JSON.stringify(list));
	},
	
	load(){
		let tmp = JSON.parse(localStorage.getItem('listNotes'));
		if(tmp){
			list = tmp;
		}
	},
	
	editNote(i, modif){
		list[i].setTitre(modif.titre);
		list[i].setContenu(modif.contenu);
		save();
		return list[i];
	},
	
	delete(i){
		noteList.list.splice(i,1);
		//delete noteList.list[i];
		save();
		mainMenuView.init();
	}		
}

let noteListView = {
		
	currentNodeNote : null,
		
    displayItem(note, i=null) {
    	/*//dans t on met sous forme de TextNode la note avec le titre et la date
        let t = document.createTextNode(note.titre+' '+note.date_creation.toDateString())
        //on crée un div
        let d = document.createElement('div')
        //dans le div je met le t
        d.appendChild(t)
        //dans noteListView je met ce div d
        document.querySelector('#noteListView').appendChild(d)
        //quand je clique dessus ça selectionne la note
        d.addEventListener('click',this.selectionnerNote)*/
    	let tmpHtml = document.createElement('div');
    	tmpHtml.classList.add('note_list_item');
    	tmpHtml.innerHTML = note.titre;
    	if (i == null ){
    		i = noteList.addNote(note) - 1;
    		//console.log(i);
    	}
    		tmpHtml.id = i;
    		document.querySelector('#noteListView').appendChild(tmpHtml);
    		this.selectCurrentNote(tmpHtml);
    		tmpHtml.addEventListener('click',this.addHandler)
    	
    },
    
    suppr(i){
    	var element = document.getElementById(i);
    	element.parentNode.removeChild(element);
    },
    
    addHandler(e){
    	noteListView.selectCurrentNote(e.target);
    	noteView.afficher(noteList.get(e.target.id));
    },
    
    selectCurrentNote(nodeNote){
    	noteFormView.hide();
    	if(this.currentNodeNote){
    		this.currentNodeNote.classList.remove('note_list_item-selected');
    	}
    		nodeNote.classList.add('note_list_item-selected');
    		this.currentNodeNote = nodeNote;
    	
    },
    
    
   /* selectionnerNote(event) {
        //console.log(event.target.parentNode.children);
        let items = event.target.parentNode.children
        for(let i=0; i<items.length; i++) {
            //console.log(items[i]);
            let item = items[i];
            if (item == event.target) {
                item.classList.add('note_list_item-selected');
                app.indiceCourant = i;
                noteView.afficher(i);
            } else {
                item.classList.remove('note_list_item-selected');
            }
        }
    }*/
    
    delete(){
    	noteList.delete(noteListView.currentNodeNote.id);
    	noteListView.currentNodeNote.remove();
    	noteView.hide();
    	
    }
}

let mainMenuView = {
	addHandler(){
		//afficher le formulaire
		noteFormView.display();
	},

	init(){
		//bouton plus
		document.querySelector("#add").addEventListener("click", this.addHandler);
		//bouton valider
		document.querySelector("#form_add_note_valid").addEventListener("click",noteFormView.validate);
		//bouton edit
		document.querySelector('#edit').addEventListener("click",noteFormView.edit);
		//bouton supprimer
		document.querySelector('#del').addEventListener("click",noteListView.delete);
		noteList.load();
		
		if(noteList.list){
			noteList.list.forEach((note, i) => {
				noteListView.displayItem(note, i);
			})
			
		}

	}
}	


let app = {
		note : null,
		indiceCourant : null,
		init(){
			//on génère le tout.
			mainMenuView.init()
		}
}

 //on appel la méthode pour générer le tout
window.onload = app.init;




		

