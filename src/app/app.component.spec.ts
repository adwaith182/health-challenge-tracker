import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers', 'addUser', 'filterUsers']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userServiceSpy.getUsers.and.returnValue(of([]));

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'health-challenge-tracker' title`, () => {
    expect(component.title).toEqual('health-challenge-tracker');
  });

  it('should initialize dataSource with empty array', () => {
    expect(component.dataSource).toBeTruthy();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should call userService.getUsers on ngOnInit', () => {
    expect(userServiceSpy.getUsers).toHaveBeenCalled();
  });

  it('should add workout when all fields are filled', () => {
    component.newUser = 'John';
    component.newWorkoutType = 'Running';
    component.newWorkoutMinutes = 30;

    component.addWorkout();

    expect(userServiceSpy.addUser).toHaveBeenCalledWith('John', 'Running', 30);
    expect(component.newUser).toBe('');
    expect(component.newWorkoutType).toBe('');
    expect(component.newWorkoutMinutes).toBe(0);
  });

  it('should not add workout when fields are missing', () => {
    component.newUser = 'John';
    component.newWorkoutType = '';
    component.newWorkoutMinutes = 30;

    component.addWorkout();

    expect(userServiceSpy.addUser).not.toHaveBeenCalled();
  });

  it('should return correct workouts string', () => {
    const workouts = [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 45 }
    ];
    expect(component.getWorkoutsString(workouts)).toBe('Running, Cycling');
  });

  it('should calculate total minutes correctly', () => {
    const workouts = [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 45 }
    ];
    expect(component.getTotalMinutes(workouts)).toBe(75);
  });

  it('should apply filter', () => {
    component.searchTerm = 'John';
    component.workoutTypeFilter = 'Running';
    component.applyFilter();
    expect(userServiceSpy.filterUsers).toHaveBeenCalledWith('John', 'Running');
  });
});
