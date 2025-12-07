import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutFormComponent } from './features/workout-form/workout-form';
import { BoardComponent } from './features/board/board';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WorkoutFormComponent,
    BoardComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App { }
