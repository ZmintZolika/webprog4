import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsService } from '../../services/achievements';
import { WorkoutsService } from '../../services/workouts';
import { Achievement } from '../../models/achievement';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.html',
  styleUrls: ['./achievements.css']
})
export class AchievementsComponent implements OnInit {
  achievements: Achievement[] = [];

  constructor(
    private achievementsService: AchievementsService,
    private workoutsService: WorkoutsService
  ) { }

  async ngOnInit(): Promise<void> {
    const workouts = await this.workoutsService.getAll();
    this.achievements = this.achievementsService.getAllAchievements(workouts);
  }
}
