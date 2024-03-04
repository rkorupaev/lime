import {FeatureCollection, GeoJsonProperties, Geometry} from 'geojson'

export type Coord = {
    longitude: number
    latitude: number
    date: string
    device_id?: string
    log_time?: string
    id: number
}

export const coordsToGeoJsonLine = (coords: Coord[]): FeatureCollection<Geometry, GeoJsonProperties> => {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    coordinates: coords.map((item) => {
                        return [item.longitude, item.latitude]
                    }),
                    type: 'LineString',
                },
            },
        ],
    }
}

export const coordsToGeoJsonPoints = (coords: Coord[]): FeatureCollection<Geometry, GeoJsonProperties> => {
    return {
        type: 'FeatureCollection',
        features: coords.map((item) => {
            return {
                type: 'Feature',
                properties: {
                    timeStamp: item.date,
                },
                geometry: {
                    coordinates: [item.longitude, item.latitude],
                    type: 'Point',
                },
            }
        }),
    }
}
