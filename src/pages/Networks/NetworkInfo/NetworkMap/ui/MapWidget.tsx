// @ts-nocheck
import dayjs from 'dayjs'
import mapboxgl from 'mapbox-gl'
import React, {memo, useEffect, useRef, useState} from 'react'
import './MapWidget.css'

import MarkerIcon from '../assets/marker.png'
import {Coord, coordsToGeoJsonLine, coordsToGeoJsonPoints} from '../utils/mapUtils.ts'

mapboxgl.accessToken = 'pk.eyJ1IjoicmtvcnVwYWV2IiwiYSI6ImNsb3d1czAxMzE4NHQyaWxldDVsbW9nOXoifQ.6aYOG6me_D9biJL1TZTYJw'

interface MapWidgetProps {
    coords: Coord[]
}

type MapType = 'streets-v12' | 'satellite-v9' | 'satellite-streets-v12'

export const MapWidget = memo((props: MapWidgetProps) => {
    MapWidget.displayName = 'MapWidget';
    const {coords} = props;
    const mapContainer = useRef<any>(null);
    const [mapObject, setMap] = useState<mapboxgl.Map | null>(null);
    const [mapStyle, setMapStyle] = useState<MapType>('streets-v12');
    const [selectedCoordsInterval, setSelectedCoordsInterval] = useState<Coord[]>(coords);
    const [currentPoint, setCurrentPoint] = useState<number>(0);

    useEffect(() => {
        if (coords) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: `mapbox://styles/mapbox/${mapStyle}`,
                center: [
                    selectedCoordsInterval[0].longitude,
                    selectedCoordsInterval[0].latitude,
                ],
                zoom: 11,
                attributionControl: false,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                language: 'ru-Ru',
            })

            map.addControl(new mapboxgl.NavigationControl())
            map.addControl(new mapboxgl.ScaleControl())
            map.addControl(new mapboxgl.FullscreenControl())

            // Определение линии маршрута
            map.on('style.load', () => {
                map?.addSource('line', {
                    type: 'geojson',
                    data: coordsToGeoJsonLine(selectedCoordsInterval),
                })

                map?.loadImage(MarkerIcon, function (error, image) {
                    if (error) throw error

                    image && map?.addImage('marker-icon', image) // 'custom-icon' - уникальное имя для вашего изображения
                })

                // Добавление слоя бэкграунда для маршрута
                // map?.addLayer({
                //     type: 'line',
                //     source: 'line',
                //     id: 'line-background',
                //     paint: {
                //         'line-color': '#92aaf8',
                //         'line-width': 6,
                //         'line-opacity': 0.4,
                //     },
                // })
                //
                // // Добавление слоя пунктира на маршрут
                // map?.addLayer({
                //     type: 'line',
                //     source: 'line',
                //     id: 'line-dashed',
                //     paint: {
                //         'line-color': '#77aff6',
                //         'line-width': 6,
                //         'line-dasharray': [0, 4, 3],
                //     },
                // })

                // Добавление точек маршрута

                map?.addSource('points', {
                    type: 'geojson',
                    data: coordsToGeoJsonPoints(selectedCoordsInterval),
                })

                map?.addLayer({
                    id: 'points',
                    type: 'symbol',
                    source: 'points',
                    layout: {
                        'icon-image': 'marker-icon',
                        'icon-size': 0.06,
                        'icon-anchor': 'bottom',
                    },
                })

                // Добавление попапов на точки маршрута

                map?.on('click', 'points', (e) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    const coordinates = e.features![0].geometry.coordinates.slice()

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                    }

                    map &&
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(
                            `
                                <p>Широта: ${e.lngLat.lat}</p>
                                <p>Долгота: ${e.lngLat.lng}</p>
                                <p>Время: ${dayjs(e.features![0].properties!.timeStamp).format('DD.MM.YYYY, HH:mm')}</p>
                            `
                        )
                        .addTo(map)
                })

                map?.on('mouseenter', 'points', () => {
                    if (map) {
                        map.getCanvas().style.cursor = 'pointer'
                    }
                })

                map?.on('mouseleave', 'points', () => {
                    if (map) {
                        map.getCanvas().style.cursor = ''
                    }
                })

                // Блок анимации маршрута
                // const dashArraySequence = [
                //     [0, 4, 3],
                //     [0.5, 4, 2.5],
                //     [1, 4, 2],
                //     [1.5, 4, 1.5],
                //     [2, 4, 1],
                //     [2.5, 4, 0.5],
                //     [3, 4, 0],
                //     [0, 0.5, 3, 3.5],
                //     [0, 1, 3, 3],
                //     [0, 1.5, 3, 2.5],
                //     [0, 2, 3, 2],
                //     [0, 2.5, 3, 1.5],
                //     [0, 3, 3, 1],
                //     [0, 3.5, 3, 0.5],
                // ]

                // let step = 0
                //
                // function animateDashArray(timestamp: number) {
                //     const newStep = Math.floor((timestamp / 50) % dashArraySequence.length)
                //
                //     if (newStep !== step) {
                //         map &&
                //         map.setPaintProperty('line-dashed', 'line-dasharray', dashArraySequence[step])
                //         step = newStep
                //     }
                //
                //     requestAnimationFrame(animateDashArray)
                // }
                //
                // animateDashArray(0)
            })
            setMap(map);
        }
    }, []);

    useEffect(() => {
        if (mapObject) {
            mapObject.setCenter([coords[0].longitude, coords[0].latitude]);
            const source = mapObject.getSource('points');

            if (source) source.setData(
                coordsToGeoJsonPoints(coords)
            )
        }
    }, [deviceStore.currentDevice]);

    useEffect(() => {
        setCurrentPoint(0);
        if (mapObject) {
            mapObject.setCenter([selectedCoordsInterval[0].longitude, selectedCoordsInterval[0].latitude]);
            const source = mapObject.getSource('points');
            const line = mapObject.getSource('line');

            if (source) source.setData(
                coordsToGeoJsonPoints(selectedCoordsInterval)
            )

            if (line) line.setData(
                coordsToGeoJsonLine(selectedCoordsInterval)
            )
        }
    }, [selectedCoordsInterval]);

    useEffect(() => {
        if (mapObject) {
            mapObject.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
        }
    }, [mapStyle]);

    useEffect(() => {
        if (mapObject) {
            mapObject.setCenter([selectedCoordsInterval[currentPoint].longitude, selectedCoordsInterval[currentPoint].latitude]);
        }
    }, [currentPoint]);

    return (
        <div className={'widget-container3'}>
            <div ref={mapContainer} className={'map-container3'}>
                {!selectedCoordsInterval && 'Нет элементов для отображения'}
            </div>
        </div>
    )
})
