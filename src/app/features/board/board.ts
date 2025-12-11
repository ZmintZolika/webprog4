import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutsService } from '../../services/workouts';
import { Workout } from '../../models/workout';
import { Subscription, interval } from 'rxjs';
import { TitleFilterPipe } from '../../shared/title-filter-pipe';
import { AchievementsService } from '../../services/achievements';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TitleFilterPipe],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  all = signal<Workout[]>([]);
  query = signal<string>('');
  loading = signal<boolean>(false);

  private sub?: Subscription;
  private timerSub?: Subscription;

  filtered = computed<Workout[]>(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.all();
    return q ? list.filter((w: Workout) => w.title.toLowerCase().includes(q)) : list;
  });

  planned = computed<Workout[]>(() => this.filtered().filter((w: Workout) => w.status === 'planned'));
  active = computed<Workout[]>(() => this.filtered().filter((w: Workout) => w.status === 'active'));
  completed = computed<Workout[]>(() =>
    this.filtered()
      .filter((w: Workout) => w.status === 'completed' && !w.isRunning)  // Csak ha NEM fut
      .sort((a, b) => b.id - a.id)
  );



  constructor(
    private workouts: WorkoutsService,
    private achievements: AchievementsService
  ) { }


  async ngOnInit(): Promise<void> {
    await this.reload();
    this.sub = this.workouts.changes$.subscribe(() => this.reload());


    this.timerSub = interval(1000).subscribe(() => {
      this.all.set([...this.all()]);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timerSub?.unsubscribe();
  }

  private async reload(): Promise<void> {
    this.loading.set(true);
    this.all.set(await this.workouts.getAll());
    this.loading.set(false);

    // Jelvények ellenőrzése
    const newAchievements = this.achievements.checkAchievements(this.all());
    if (newAchievements.length > 0) {
      newAchievements.forEach(ach => {
        alert(`🎉 Új jelvény feloldva!\n\n${ach.icon} ${ach.title}\n${ach.description}`);
      });
    }
  }


  onQueryChange(ev: Event): void {
    const value = (ev.target as HTMLInputElement | null)?.value ?? '';
    this.query.set(value);
  }

  async onIntensityChange(w: Workout, ev: Event): Promise<void> {
    const value = (ev.target as HTMLSelectElement | null)?.value as Workout['intensity'] ?? 'moderate';
    await this.workouts.update(w.id, { intensity: value });
  }

  async moveLeft(w: Workout): Promise<void> {
    const next =
      w.status === 'active' ? 'planned' :
        w.status === 'completed' ? 'active' :
          'planned';

    await this.workouts.update(w.id, { status: next });

    // Ha Aktívba került (bárhonnan), indítsuk el
    if (next === 'active' && !w.isRunning) {
      await this.workouts.update(w.id, {
        isRunning: true,
        startTime: Date.now()
      });
    }
  }


  async moveRight(w: Workout): Promise<void> {
    const next =
      w.status === 'planned' ? 'active' :
        w.status === 'active' ? 'completed' :
          'completed';

    await this.workouts.update(w.id, { status: next });

    if (next === 'active' && !w.isRunning) {
      await this.workouts.update(w.id, {
        isRunning: true,
        startTime: Date.now()
      });
    }
  }




  async deleteWorkout(w: Workout): Promise<void> {
    if (confirm(`Törlöd: ${w.title}?`)) {
      await this.workouts.remove(w.id);
    }
  }

  async startTimer(w: Workout): Promise<void> {
    await this.workouts.update(w.id, {
      isRunning: true,
      startTime: Date.now(),
      duration: w.duration || 0,
      status: 'active'
    });
  }



  async stopTimer(w: Workout): Promise<void> {
    if (w.isRunning && w.startTime) {
      const elapsed = Math.floor((Date.now() - w.startTime) / 1000);
      const total = (w.duration || 0) + elapsed;
      await this.workouts.update(w.id, {
        isRunning: false,
        duration: total,
        startTime: undefined,
        status: 'completed'
      });
    }
  }

  getDisplayTime(w: Workout): string {
    let seconds = w.duration || 0;
    if (w.isRunning && w.startTime) {
      seconds += Math.floor((Date.now() - w.startTime) / 1000);
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
