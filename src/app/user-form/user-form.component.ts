import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="name" name="name" placeholder="Name" required>
      <input [(ngModel)]="workoutType" name="workoutType" placeholder="Workout Type" required>
      <input [(ngModel)]="minutes" name="minutes" type="number" placeholder="Minutes" required>
      <button type="submit">Add User</button>
    </form>
  `
})
export class UserFormComponent {
  @Output() userAdded = new EventEmitter<{name: string, workoutType: string, minutes: number}>();

  name = '';
  workoutType = '';
  minutes = 0;

  onSubmit() {
    if (this.name && this.workoutType && this.minutes > 0) {
      this.userAdded.emit({name: this.name, workoutType: this.workoutType, minutes: this.minutes});
      this.name = '';
      this.workoutType = '';
      this.minutes = 0;
    }
  }
}
