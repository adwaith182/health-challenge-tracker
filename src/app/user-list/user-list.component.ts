import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Workouts</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users">
          <td>{{user.name}}</td>
          <td>
            <ul>
              <li *ngFor="let workout of user.workouts">
                {{workout.type}} - {{workout.minutes}} minutes
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class UserListComponent {
  @Input() users: User[] = [];
}
