function Note(t,c){
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
	//un objet
let noteFormView = {
		display(){
			//on select l'id noteForm
			//on enlève un élément CSS
			//correspond à un dispay : none en CSS (on l'enlève, on affiche le formulaire)
			document.querySelector("#noteForm").classList.remove('create_edit_note-hidden');
		},
		
		hide(){
			//on l'add (on cache le formulaire)
			document.querySelector("#noteForm").classList.add('create_edit_note-hidden');
		},
		
		//permet d'afficher l'objet note
		validate(){
			//on met dans t la valeur du titre
			let t = document.querySelector('#form_add_note_title').value;
			//on met dans c la valeur du contenu
			let c = document.querySelector('#form_add_note_text').value;
			let n = new Note(t,c);
			//on appel la méthode de l'objet noteView
			// i renvoie un indice
			//let i = noteList.addNote(n);
			//console.log(i);
			noteFormView.hide();
			noteView.afficher(n); 
			noteListView.displayItem(n);
			},
		
		edit(){
			if (!noteListView.currentNodeView){
				return;
			}
		
		let note = noteList.get(noteListView.currentNodeList.id);
		let form = document.querySelector('#noteForm');
		form.children[0].value = note.titre;
		form.children[1].value = note.contenu;
		this.editNote = true;
		noteFormView.display();
			
		},
		
		editNote : false
}

let noteView = {
		//méthode de conversion pour l'afficher convenablement
		convertir(note){
			let markdownText = `# ${note.titre}
								${note.date_creation.toLocaleString()}
								${note.contenu}`
			//?Conversion en HTML?				
			let conv = new showdown.Converter();
			let htmlText = conv.makeHtml(markdownText);
			
			return htmlText;
		},
		
		afficher(note){														//on utilise la méthode convertir
			document.querySelector("#currentNoteView").innerHTML = this.convertir(note);
		},
		
		hide(){
			document.querySelector('#currentNoteView').innerHTML = '';
		}
}

let noteList = {
		
		 list : [],
		
		addNote(note){
				
			 	//affiche la liste de note
				//noteListView.displayItem(note);
				let indice = this.list.push(note);
				
				this.save();
				
				// retourne l'indice de la note
				return indice;
			},

		get(n){
			return this.list[n];
		},
		
		getList(){
			return this.list;
		},
		
		save(){
			//on enleve l'ancienne liste a chaque save
			localStorage.removeItem('listNotes');
			//on set le contenu à la liste actuelle
			localStorage.setItem('listNotes', JSON.stringify(this.list));
		},
		
		load(){
			let tmp = JSON.parse(localStorage.getItem('listNotes'));
			if(tmp){
				this.list = tmp;
			}
		},
		
		editNote(i, modif){
			this.list[i].setTitre(modif.titre);
			this.list[i].setContenu(modif.contenu);
			this.save();
			return this.list[i];
		},
		
		delete(i){
			console.log(i)
						
			console.log(noteList.list);

			noteList.list.splice(i,1);
			//delete noteList.list[i];
			
			console.log(noteList.list);

			
			this.save();
			mainMenuView.redo();
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
			//en cliquant on appel la méthode addHandler donc on display
			document.querySelector("#add").addEventListener("click",this.addHandler);
			//en cliquant on appel la validate de noteFormView addHandler donc on "valide la note", on l'affiche en entier (objet note)
			document.querySelector("#form_add_note_valid").addEventListener("click",noteFormView.validate);
			document.querySelector('#edit').addEventListener("click",noteFormView.edit);
			document.querySelector('#del').addEventListener("click",noteListView.delete);
			noteList.load();
			
			if(noteList.list){
				noteList.list.forEach((note, i) => {
					noteListView.displayItem(note, i);
				})
				
			}
		
		},
		
		redo(){
			noteList.list.forEach((note, i) => {
				noteListView.displayItem(note, i);
			})
		
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




		

