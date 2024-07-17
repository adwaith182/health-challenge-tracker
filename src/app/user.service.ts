import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Workout {
  type: string;
  minutes: number;
}

export interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private initialUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Running', minutes: 20 }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      workouts: [
        { type: 'Yoga', minutes: 50 },
        { type: 'Cycling', minutes: 40 }
      ]
    }
  ];

  private users: User[] = [];
  private filteredUsers: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = this.initialUsers;
      }
      this.filteredUsers = this.users;
      this.usersSubject.next(this.filteredUsers);
    }
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  addUser(name: string, workoutType: string, minutes: number): void {
    const existingUser = this.users.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (existingUser) {
      existingUser.workouts.push({ type: workoutType, minutes });
    } else {
      const newUser: User = {
        id: this.users.length + 1,
        name,
        workouts: [{ type: workoutType, minutes }]
      };
      this.users.push(newUser);
    }
    this.updateLocalStorage();
  }

  filterUsers(searchTerm: string, workoutType: string): void {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (workoutType === 'All' || user.workouts.some(w => w.type === workoutType))
    );
    this.usersSubject.next(this.filteredUsers);
  }

  private updateLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    this.filteredUsers = this.users;
    this.usersSubject.next(this.filteredUsers);
  }
}
