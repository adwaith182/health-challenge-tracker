import { Component, OnInit, Input, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { User } from '../user.service';

Chart.register(...registerables);

@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas id="workoutChart"></canvas>'
})
export class WorkoutChartComponent implements OnInit {
  @Input() users: User[] = [];
  private chart: Chart | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.createChart();
    }
  }

  createChart() {
    if (!this.isBrowser) return;

    const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            }
          }
        }
      }
    });
    this.updateChart(this.users);
  }

  updateChart(users: User[]) {
    if (!this.isBrowser || !this.chart) return;

    const workoutTypes = [...new Set(users.flatMap(u => u.workouts.map(w => w.type)))];
    const datasets = workoutTypes.map(type => ({
      label: type,
      data: users.map(u => u.workouts.find(w => w.type === type)?.minutes || 0),
      backgroundColor: this.getRandomColor()
    }));

    this.chart.data.labels = users.map(u => u.name);
    this.chart.data.datasets = datasets;
    this.chart.update();
  }

  getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
}
