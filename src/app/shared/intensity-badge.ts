import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { Workout } from '../models/workout';

@Directive({
  selector: '[appIntensityBadge]',
  standalone: true
})
export class IntensityBadgeDirective implements OnChanges {
  @Input('appIntensityBadge') intensity: Workout['intensity'] | null = null;

  constructor(private el: ElementRef<HTMLElement>) { }

  ngOnChanges(): void {
    const host = this.el.nativeElement;
    host.style.transition = 'background 0.3s ease, border-left 0.3s ease';
    host.style.borderLeft = '';
    host.style.background = '';

    if (this.intensity === 'intense') {
      host.style.borderLeft = '6px solid #ef5350';  // piros
      host.style.background = '#ffebee';
    } else if (this.intensity === 'light') {
      host.style.borderLeft = '6px solid #66bb6a';  // zöld
      host.style.background = '#e8f5e9';
    } else {
      host.style.borderLeft = '6px solid #ffa726';  // narancssárga
      host.style.background = '#fff3e0';
    }
  }
}
