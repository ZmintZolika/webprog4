export interface Workout {
    id: number;
    title: string;
    status: 'planned' | 'active' | 'completed';
    intensity: 'light' | 'moderate' | 'intense';
    duration?: number;
    isRunning?: boolean;
    startTime?: number;
    date?: string;
    userId?: number;
}
