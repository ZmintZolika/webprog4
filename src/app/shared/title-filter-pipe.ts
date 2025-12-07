import { Pipe, PipeTransform } from '@angular/core';
import { Workout } from '../models/workout';

@Pipe({
  name: 'titleFilter',
  standalone: true
})
export class TitleFilterPipe implements PipeTransform {
  transform(list: Workout[] | null | undefined, q: string): Workout[] {
    if (!list) return [];
    if (!q?.trim()) return list;
    const term = q.trim().toLowerCase();
    return list.filter(w => w.title.toLowerCase().includes(term));
  }
}
