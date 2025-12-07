import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutsService } from '../../services/workouts';
import { Workout } from '../../models/workout';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-form.html',
  styleUrls: ['./workout-form.css']
})
export class WorkoutFormComponent {
  title = '';
  intensity: Workout['intensity'] = 'moderate';
  status: Workout['status'] = 'planned';
  duration: number | null = null;

  saving = false;

  constructor(private workouts: WorkoutsService) { }

  async submit() {
    const t = this.title?.trim();
    if (!t) {
      alert('Válassz ki egy edzéstípust!');
      return;
    }

    this.saving = true;

    const durationInSeconds = this.duration ? this.duration * 60 : undefined;

    await this.workouts.add({
      title: t,
      intensity: this.intensity,
      status: this.status,        // ← NEM 'active', hanem amit választottál
      duration: durationInSeconds
    });

    this.saving = false;

    this.title = '';
    this.intensity = 'moderate';
    this.status = 'planned';
    this.duration = null;

    alert('Edzés hozzáadva!');
  }

}
