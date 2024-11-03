import type {Period, Super} from "./types.ts";

export class SuperDataMapper {
    static fromResponseData(place: any, image: { photoUri: string }): Super {
        return {
            id: place.id,
            title: place.displayName.text,
            imageUrl: image.photoUri,
            schedule: {
                periods: this.createPeriods(place.currentOpeningHours.periods),
                openNow: place.currentOpeningHours.openNow
            }
        };
    }

    private static createPeriods(periods: any[]): Period[] {
        return periods.map(period => ({
            open: this.createDateTime(period.open),
            close: this.createDateTime(period.close)
        }));
    }

    private static createDateTime(timeData: any): Date {
        const {date, hour, minute} = timeData;
        return new Date(
            date.year,
            date.month - 1, // JavaScript months are 0-based
            date.day,
            hour,
            minute
        );
    }
}