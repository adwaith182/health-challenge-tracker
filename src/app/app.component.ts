import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { UserService, User, Workout } from './user.service';
import { WorkoutChartComponent } from './workout-chart/workout-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    WorkoutChartComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'health-challenge-tracker';
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['name', 'workouts', 'numberOfWorkouts', 'totalMinutes'];
  newUser: string = '';
  newWorkoutType: string = '';
  newWorkoutMinutes: number = 0;
  searchTerm: string = '';
  workoutTypeFilter: string = 'All';
  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(WorkoutChartComponent)
  workoutChart!: WorkoutChartComponent;

  constructor(private userService: UserService) {
    this.dataSource = new MatTableDataSource<User>([]);
  }


  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.updateChart();
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.connect().subscribe(() => this.updateChart());
  }

  updateChart() {
    if (this.workoutChart) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      const paginatedData = this.dataSource.filteredData.slice(startIndex, endIndex);
      this.workoutChart.updateChart(paginatedData);
    }
  }

  addWorkout() {
    if (this.newUser && this.newWorkoutType && this.newWorkoutMinutes > 0) {
      this.userService.addUser(this.newUser, this.newWorkoutType, this.newWorkoutMinutes);
      this.newUser = '';
      this.newWorkoutType = '';
      this.newWorkoutMinutes = 0;
    }
  }

  getWorkoutsString(workouts: Workout[]): string {
    return workouts.map(w => w.type).join(', ');
  }

  getTotalMinutes(workouts: Workout[]): number {
    return workouts.reduce((total, w) => total + w.minutes, 0);
  }

  applyFilter() {
    this.userService.filterUsers(this.searchTerm, this.workoutTypeFilter);
    this.updateChart();
  }

}
