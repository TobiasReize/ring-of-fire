import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game!: Game;
  currentCard: string = '';


  constructor() {}


  ngOnInit(): void {
    this.newGame();
  }


  newGame() {
    this.game = new Game();
    console.log(this.game);
  }


  takeCard() {
    if (!this.pickCardAnimation) {
      this.pickCardAnimation = true;
      this.currentCard = this.game.stack.pop()!;  // "!" damit der Typ "undefined" entfernt wird. Ist das good oder bad practice? (theor. könnte das Array "stack" auch leer sein!)
        console.log(this.currentCard);

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
          console.log(this.game);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }


}
