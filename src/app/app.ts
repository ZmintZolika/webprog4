import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutFormComponent } from './features/workout-form/workout-form';
import { BoardComponent } from './features/board/board';
import { AchievementsComponent } from './features/achievements/achievements';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WorkoutFormComponent,
    BoardComponent,
    AchievementsComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App { }
