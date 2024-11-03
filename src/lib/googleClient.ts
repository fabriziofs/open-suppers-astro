import type {Super} from "./types.ts";
import {SuperDataMapper} from "./SuperDataMapper.ts";

export class GoogleClient {
    private GOOGLE_BASE_URL = 'https://places.googleapis.com';
    private GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;
    private queryConfig = {
        place: {
            fields: 'id,displayName,currentOpeningHours,photos',
        },
        image: {
            maxHeightPx: '400',
            maxWidthPx: '400',
        }
    };

    async searchAll(placeIds: string[]): Promise<Super[]> {
        // Fetch all place details and immediately parse the JSON
        const placeDataPromises = placeIds.map(async placeId => {
            const response = await this.request('GET', `v1/places/${placeId}`, this.queryConfig.place);
            return response.json();
        });

        const placesData = await Promise.all(placeDataPromises);

        // Fetch all image details - get the URL instead of trying to parse the binary data
        const imageDataPromises = placesData.map(placeData =>
            this.request('GET', `v1/${placeData.photos[0].name}/media`, this.queryConfig.image)
                .then(response => response.url) // Just get the URL of the image
        );

        const imageUrls = await Promise.all(imageDataPromises);

        // Map data to Super objects
        return placesData.map((placeData, index) =>
            SuperDataMapper.fromResponseData(placeData, {photoUri: imageUrls[index]})
        );
    }

    async getSuper(id: string): Promise<Super> {
        const placeResponse = await this.request('GET', `v1/places/${id}`, this.queryConfig.place);
        const placeData = await placeResponse.json();

        const imageUrl = placeData.photos[0].name;
        const imageResponse = await this.request('GET', `v1/${imageUrl}/media`, this.queryConfig.image);

        return SuperDataMapper.fromResponseData(placeData, {photoUri: imageResponse.url});
    }

    private async request(method: string, path: string, config: Record<string, string>): Promise<Response> {
        const url = new URL(`${this.GOOGLE_BASE_URL}/${path}`);

        // Add query parameters
        Object.entries(config).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        url.searchParams.append('key', this.GOOGLE_API_KEY);

        const response = await fetch(url.toString(), {method});

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    }
}

// Export singleton instance
export const googleClient = new GoogleClient();