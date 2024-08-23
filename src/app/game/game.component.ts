import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game!: Game;
  currentCard: string = '';
  currentCardNumber: number = 0;

  firestore: Firestore = inject(Firestore);
  items$;
  items;


  constructor(public dialog: MatDialog) {
    this.items$ = collectionData(this.getGamesColRef());
    this.items = this.items$.subscribe((game) => {
      console.log('Game update', game);
      // game.forEach(element => {
      //   console.log(element);
      // })
    });
  }


  ngOnInit(): void {
    this.newGame();
  }


  newGame() {
    this.game = new Game();
    this.addData();
  }


  async addData() {
    await addDoc(this.getGamesColRef(), this.game.toJson()).catch(
      (err) => {console.error(err);}
    ).then(
      (docRef) => {console.log('Dokument hinzugefügt mit ID: ', docRef?.id);}
    );
  }


  getGamesColRef() {
    return collection(this.firestore, 'games');
  }


  takeCard() {
    if (!this.pickCardAnimation && this.game.players.length > 0) {
      this.currentCard = this.game.stack.pop()!;  // "!" damit der Typ "undefined" entfernt wird. Ist das good oder bad practice? (theor. könnte das Array "stack" auch leer sein!)
      this.pickCardAnimation = true;
      this.game.currentPlayer = this.currentCardNumber % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
      }, 900);

      setTimeout(() => {
        this.pickCardAnimation = false;
        this.currentCardNumber++;
      }, 1000);
    }
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

}
