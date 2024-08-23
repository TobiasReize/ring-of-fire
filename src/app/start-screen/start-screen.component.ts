import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc } from '@firebase/firestore';
import { Game } from '../../models/game';
import { collection, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  firestore: Firestore = inject(Firestore);
  game!: Game;


  constructor(private router: Router) { }

  newGame() {
    this.game = new Game();
    this.addData();
  }

  
  async addData() {
    await addDoc(collection(this.firestore, 'games'), this.game.toJson()).catch(
      (err) => {console.error(err);}
    ).then(
      (gameRef) => {this.router.navigateByUrl('/game/' + gameRef?.id);}
    );
  }
}
