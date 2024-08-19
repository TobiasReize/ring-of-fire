import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game!: Game;
  currentCard: string = '';
  currentCardNumber: number = 0;


  constructor(public dialog: MatDialog) {}


  ngOnInit(): void {
    this.newGame();
  }


  newGame() {
    this.game = new Game();
    console.log(this.game);
  }


  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()!;  // "!" damit der Typ "undefined" entfernt wird. Ist das good oder bad practice? (theor. könnte das Array "stack" auch leer sein!)
        console.log(this.currentCard);
      this.pickCardAnimation = true;
      this.game.currentPlayer = this.currentCardNumber % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
          console.log(this.game);
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
      if (name != '') {
        this.game.players.push(name);
      }
    });
  }

}
