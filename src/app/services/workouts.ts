import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';
import { Workout } from '../models/workout';

@Injectable({ providedIn: 'root' })
export class WorkoutsService {
  private readonly storageKey = 'fitness-workouts';
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  changes$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Workout[]> {
    const cached = this.loadFromStorage();
    if (cached.length > 0) return cached;

    const todos = await firstValueFrom(
      this.http.get<any[]>(this.apiUrl + '?_limit=10')
    );

    const workouts: Workout[] = todos.map((t, i) => ({
      id: i + 1,
      title: this.randomWorkoutTitle(),
      status: t.completed ? 'completed' : 'planned',
      intensity: this.randomIntensity(),
      //duration: Math.floor(Math.random() * 60) + 15,
      userId: t.userId
    }));

    this.saveToStorage(workouts);
    return workouts;
  }

  async add(data: Omit<Workout, 'id'>): Promise<void> {
    const all = this.loadFromStorage();
    const newId = all.length > 0 ? Math.max(...all.map(w => w.id)) + 1 : 1;
    all.push({ ...data, id: newId });
    this.saveToStorage(all);
    this.changes$.next();
  }

  async update(id: number, changes: Partial<Workout>): Promise<void> {
    const all = this.loadFromStorage();
    const idx = all.findIndex(w => w.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...changes };
      this.saveToStorage(all);
      this.changes$.next();
    }
  }

  async remove(id: number): Promise<void> {
    let all = this.loadFromStorage();
    all = all.filter(w => w.id !== id);
    this.saveToStorage(all);
    this.changes$.next();
  }

  private loadFromStorage(): Workout[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveToStorage(list: Workout[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  private randomWorkoutTitle(): string {
    const titles = ['Futás', 'Súlyzózás', 'Yoga', 'Úszás', 'Kerékpár', 'Séta', 'HIIT', 'Stretching', 'Box', 'Aerobic'];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private randomIntensity(): Workout['intensity'] {
    const opts: Workout['intensity'][] = ['light', 'moderate', 'intense'];
    return opts[Math.floor(Math.random() * opts.length)];
  }
}

