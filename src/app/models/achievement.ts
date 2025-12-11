export interface Achievement {
    id: string;
    title: string;
    icon: string;
    description: string;
    condition: (workouts: any[]) => boolean;
    unlocked?: boolean;
    unlockedAt?: Date;
}
