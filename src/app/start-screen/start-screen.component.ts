import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc } from '@firebase/firestore';
import { Game } from '../../models/game';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {


  constructor(private router: Router, private firebaseService: FirebaseService) { }


  newGame() {
    this.addData();
  }


  async addData() {
    await addDoc(this.firebaseService.getGamesColRef(), this.firebaseService.game.toJson()).catch(
      (err) => {console.error(err);}
    ).then(
      (gameRef) => {this.router.navigateByUrl('/game/' + gameRef?.id);}
    );
  }
}
