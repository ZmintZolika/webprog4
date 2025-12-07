import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Workout } from '../models/workout';

@Injectable({ providedIn: 'root' })
export class WorkoutsService {
  private readonly storageKey = 'fitness-workouts';

  changes$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Workout[]> {
    return this.loadFromStorage();
  }

  async add(data: Omit<Workout, 'id'>): Promise<void> {
    const all = this.loadFromStorage();
    const newId = all.length > 0 ? Math.max(...all.map(w => w.id)) + 1 : 1;

    const now = Date.now();

    const isActive = data.status === 'active';

    all.push({
      ...data,
      id: newId,
      isRunning: isActive,          // csak active-nél fusson
      startTime: isActive ? now : undefined
    });

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
}
