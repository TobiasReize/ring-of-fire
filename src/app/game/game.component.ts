import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  unsubGame!: Unsubscribe;
  gameId: string = '';


  constructor(private route: ActivatedRoute, public dialog: MatDialog, public firebaseService: FirebaseService) {}


  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        this.gameId = params['id'];
        this.unsubGame = this.subGame();
      }
    );
  }


  subGame() {
    return onSnapshot(this.firebaseService.getSingleDocRef('games', this.gameId), (game) => {
      let gameData: any = game.data();  //um nur die reinen Daten zu erhalten! (key-value pair)
      this.firebaseService.game.currentPlayer = gameData.currentPlayer;
      this.firebaseService.game.players = gameData.players;
      this.firebaseService.game.playedCards = gameData.playedCards;
      this.firebaseService.game.stack = gameData.stack;
      this.firebaseService.game.pickCardAnimation = gameData.pickCardAnimation;
      this.firebaseService.game.currentCard = gameData.currentCard;
      this.firebaseService.game.currentCardNumber = gameData.currentCardNumber;
    });
  }


  ngOnDestroy(): void {
    this.unsubGame();
  }


  takeCard() {
    if (!this.firebaseService.game.pickCardAnimation && this.firebaseService.game.players.length > 0 && this.firebaseService.game.stack.length > 0) {
      this.firebaseService.game.currentCard = this.firebaseService.game.stack.pop()!;  // "!" damit der Typ "undefined" entfernt wird. Ist das good oder bad practice? (theor. könnte das Array "stack" auch leer sein!)
      this.firebaseService.game.pickCardAnimation = true;
      this.firebaseService.game.currentPlayer = this.firebaseService.game.currentCardNumber % this.firebaseService.game.players.length;
      this.firebaseService.saveGame(this.gameId, this.firebaseService.game.toJson());

      setTimeout(() => {
        this.firebaseService.game.playedCards.push(this.firebaseService.game.currentCard);
      }, 900);

      setTimeout(() => {
        this.firebaseService.game.pickCardAnimation = false;
        this.firebaseService.game.currentCardNumber++;
        this.firebaseService.saveGame(this.gameId, this.firebaseService.game.toJson());
      }, 1000);
    }
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.firebaseService.game.players.push(name);
        this.firebaseService.saveGame(this.gameId, this.firebaseService.game.toJson());
      }
    });
  }
}