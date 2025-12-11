import { Injectable } from '@angular/core';
import { Achievement } from '../models/achievement';
import { Workout } from '../models/workout';

@Injectable({ providedIn: 'root' })
export class AchievementsService {
    private readonly storageKey = 'fitness-achievements';

    private allAchievements: Achievement[] = [
        {
            id: 'first_workout',
            title: 'Első lépés',
            icon: '🎉',
            description: 'Teljesítsd az első edzésedet',
            condition: (workouts) => workouts.filter(w => w.status === 'completed').length >= 1
        },
        {
            id: 'five_workouts',
            title: 'Kitartó',
            icon: '💪',
            description: 'Fejezz be 5 edzést',
            condition: (workouts) => workouts.filter(w => w.status === 'completed').length >= 5
        },
        {
            id: 'ten_hours',
            title: 'Időmester',
            icon: '⏰',
            description: 'Gyűjts össze 10 óra edzésidőt',
            condition: (workouts) => {
                const total = workouts
                    .filter(w => w.status === 'completed')
                    .reduce((sum, w) => sum + (w.duration || 0), 0);
                return total >= 36000;
            }
        },
        {
            id: 'three_intense',
            title: 'Vaskalapos',
            icon: '🔥',
            description: 'Végezz 3 intenzív edzést',
            condition: (workouts) =>
                workouts.filter(w => w.status === 'completed' && w.intensity === 'intense').length >= 3
        }
    ];

    constructor() { }

    checkAchievements(workouts: Workout[]): Achievement[] {
        const unlocked = this.getUnlocked();
        const newlyUnlocked: Achievement[] = [];

        for (const achievement of this.allAchievements) {
            if (!unlocked[achievement.id] && achievement.condition(workouts)) {
                unlocked[achievement.id] = new Date().toISOString();
                newlyUnlocked.push({ ...achievement, unlocked: true, unlockedAt: new Date() });
            }
        }

        if (newlyUnlocked.length > 0) {
            this.saveUnlocked(unlocked);
        }

        return newlyUnlocked;
    }

    getAllAchievements(workouts: Workout[]): Achievement[] {
        const unlocked = this.getUnlocked();

        return this.allAchievements.map(ach => ({
            ...ach,
            unlocked: !!unlocked[ach.id],
            unlockedAt: unlocked[ach.id] ? new Date(unlocked[ach.id]) : undefined
        }));
    }

    private getUnlocked(): Record<string, string> {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : {};
    }

    private saveUnlocked(data: Record<string, string>): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
}
