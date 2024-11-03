export interface Period {
    open: Date;
    close: Date;
}

export interface Schedule {
    periods: Period[];
    openNow: boolean;
}

export interface Super {
    id: string;
    title: string;
    imageUrl: string;
    schedule: Schedule;
}