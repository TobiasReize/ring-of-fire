import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-dialog-add-player',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogTitle],
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss'
})
export class DialogAddPlayerComponent {

  name: string = '';
  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<DialogAddPlayerComponent>);


  constructor() {}


  onNoClick() {
    this.dialogRef.close();
  }

}
