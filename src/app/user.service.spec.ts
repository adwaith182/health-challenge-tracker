import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { PLATFORM_ID } from '@angular/core';
import { take } from 'rxjs/operators';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: Storage, useFactory: () => {
            let storage: { [key: string]: string } = {};
            return {
              getItem: (key: string): string | null => key in storage ? storage[key] : null,
              setItem: (key: string, value: string): void => { storage[key] = value; },
              removeItem: (key: string): void => { delete storage[key]; },
              clear: (): void => { storage = {}; },
              length: 0,
              key: (_index: number): string | null => null
            };
          }
        }
      ]
    });
    service = TestBed.inject(UserService);
    (service as any).users = [];
    (service as any).filteredUsers = [];
    (service as any).usersSubject.next([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a user', (done) => {
    service.getUsers().pipe(take(1)).subscribe(initialUsers => {
      expect(initialUsers.length).toBe(0);

      service.addUser('John Doe', 'Running', 30);

      service.getUsers().pipe(take(1)).subscribe(updatedUsers => {
        expect(updatedUsers.length).toBe(1);
        expect(updatedUsers[0].name).toBe('John Doe');
        expect(updatedUsers[0].workouts.length).toBe(1);
        expect(updatedUsers[0].workouts[0].type).toBe('Running');
        expect(updatedUsers[0].workouts[0].minutes).toBe(30);
        done();
      });
    });
  });

  it('should have initial users in non-test environment', (done) => {
    (service as any).users = (service as any).initialUsers;
    (service as any).filteredUsers = (service as any).initialUsers;
    (service as any).usersSubject.next((service as any).initialUsers);

    service.getUsers().pipe(take(1)).subscribe(users => {
      expect(users.length).toBe(3);
      expect(users[0].name).toBe('John Doe');
      expect(users[1].name).toBe('Jane Smith');
      expect(users[2].name).toBe('Mike Johnson');
      done();
    });
  });
});
