import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  firestore: Firestore = inject(Firestore);
  game: Game;


  constructor() { 
    this.game = new Game();
  }


  getGamesColRef() {
    return collection(this.firestore, 'games');
  }


  getSingleDocRef(colId:string, docId:string) {   //gibt eine Referenz auf ein einzelnes Dokument zurück!
    return doc(collection(this.firestore, colId), docId);
  }


  async saveGame(docId: string, data:{}) {
    let docRef = this.getSingleDocRef('games', docId);
    await updateDoc(docRef, data).catch(
      (err) => {console.error(err);}
    );
  }
}
