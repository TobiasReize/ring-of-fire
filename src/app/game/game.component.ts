import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { addDoc, collection, collectionData, doc, Firestore, getDoc, onSnapshot, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  game!: Game;


  firestore: Firestore = inject(Firestore);
  unsubGame!: Unsubscribe;
  gameId:string = '';


  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}


  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(
      (params) => {
        this.gameId = params['id'];
        this.unsubGame = onSnapshot(this.getSingleDocRef('games', this.gameId), (game) => {
          let gameData: any = game.data();
          this.game.currentPlayer = gameData.currentPlayer;
          this.game.players = gameData.players;
          this.game.playedCards = gameData.playedCards;
          this.game.stack = gameData.stack;
          this.game.pickCardAnimation = gameData.pickCardAnimation;
          this.game.currentCard = gameData.currentCard;
          this.game.currentCardNumber = gameData.currentCardNumber;
        });
      }
    );
  }


  newGame() {
    this.game = new Game();
  }


  getGamesColRef() {
    return collection(this.firestore, 'games');
  }


  getSingleDocRef(colId:string, docId:string) {   //gibt eine Referenz auf ein einzelnes Dokument zurück!
    return doc(collection(this.firestore, colId), docId);
  }


  takeCard() {
    if (!this.game.pickCardAnimation && this.game.players.length > 0) {
      this.game.currentCard = this.game.stack.pop()!;  // "!" damit der Typ "undefined" entfernt wird. Ist das good oder bad practice? (theor. könnte das Array "stack" auch leer sein!)
      this.game.pickCardAnimation = true;
      this.game.currentPlayer = this.game.currentCardNumber % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
      }, 900);

      setTimeout(() => {
        this.game.pickCardAnimation = false;
        this.game.currentCardNumber++;
        this.saveGame();
      }, 1000);
    }
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }


  async saveGame() {
    let docRef = this.getSingleDocRef('games', this.gameId);
    await updateDoc(docRef, this.game.toJson()).catch(
      (err) => {console.error(err);}
    );
  }

}
