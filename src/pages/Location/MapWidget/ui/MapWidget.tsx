// @ts-nocheck
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {SelectChangeEvent} from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, {Dayjs} from 'dayjs'
import mapboxgl from 'mapbox-gl'
import React, {useEffect, useRef, useState} from 'react'
import './MapWidget.css'
import deviceStore from "../../../../stores/deviceStore";

import MarkerIcon from '../assets/marker.png'
import {Coord, coordsToGeoJsonLine, coordsToGeoJsonPoints} from '../utils/mapUtils.ts'
import LabelAndText from "../../../../shared/LabelAndText/LabelAndText";
import {prettifyDate} from "../../../../utils/utils";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import gpsStore from "../../../../stores/gpsStore";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";


mapboxgl.accessToken = 'pk.eyJ1IjoicmtvcnVwYWV2IiwiYSI6ImNsb3d1czAxMzE4NHQyaWxldDVsbW9nOXoifQ.6aYOG6me_D9biJL1TZTYJw'

interface MapWidgetProps {
    coords: Coord[],
    getLocations: ({device_id: string, date__from: string, date__till: string}) => unknown[];
}

type MapType = 'streets-v12' | 'satellite-v9' | 'satellite-streets-v12'

export const MapWidget = observer((props: MapWidgetProps) => {
    MapWidget.displayName = 'MapWidget';
    const {coords, getLocations} = props;
    const mapContainer = useRef<any>(null);
    const [mapObject, setMap] = useState<mapboxgl.Map | null>(null);
    const [mapStyle, setMapStyle] = useState<MapType>('streets-v12');
    const [selectedCoordsInterval, setSelectedCoordsInterval] = useState<Coord[]>(coords);
    const [dateStart, setDateStart] = useState<Dayjs>(() => dayjs(coords.at(-1)?.date));
    const [dateEnd, setDateEnd] = useState<Dayjs>(() => dayjs(coords[0]?.date));
    const [currentPoint, setCurrentPoint] = useState<number>(0);

    useEffect(() => {
        let interval = null;
        if (coords && selectedCoordsInterval.length) {
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
            map.on('load', () => {
                map?.addSource('line', {
                    type: 'geojson',
                    data: coordsToGeoJsonLine(selectedCoordsInterval),
                })

                map?.loadImage(MarkerIcon, function (error, image) {
                    if (error) throw error

                    image && map?.addImage('marker-icon', image) // 'custom-icon' - уникальное имя для вашего изображения
                })

                // Добавление слоя бэкграунда для маршрута
                map?.addLayer({
                    type: 'line',
                    source: 'line',
                    id: 'line-background',
                    paint: {
                        'line-color': '#92aaf8',
                        'line-width': 6,
                        'line-opacity': 0.4,
                    },
                })

                // Добавление слоя пунктира на маршрут
                map?.addLayer({
                    type: 'line',
                    source: 'line',
                    id: 'line-dashed',
                    paint: {
                        'line-color': '#77aff6',
                        'line-width': 6,
                        'line-dasharray': [0, 4, 3],
                    },
                })

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
                const dashArraySequence = [
                    [0, 4, 3],
                    [0.5, 4, 2.5],
                    [1, 4, 2],
                    [1.5, 4, 1.5],
                    [2, 4, 1],
                    [2.5, 4, 0.5],
                    [3, 4, 0],
                    [0, 0.5, 3, 3.5],
                    [0, 1, 3, 3],
                    [0, 1.5, 3, 2.5],
                    [0, 2, 3, 2],
                    [0, 2.5, 3, 1.5],
                    [0, 3, 3, 1],
                    [0, 3.5, 3, 0.5],
                ]

                let step = 0

                function animateDashArray() {
                    // const newStep = Math.floor((timestamp / 50) % dashArraySequence.length)

                    // if (newStep !== step) {
                    //     map.getLayer('line-dashed') &&
                    //     map.setPaintProperty('line-dashed', 'line-dasharray', dashArraySequence[step])
                    //     step = newStep
                    // }

                    interval = setInterval(() => {
                        step = (step + 1) % dashArraySequence.length;
                        map.setPaintProperty('line-dashed', 'line-dasharray', dashArraySequence[step]);
                    }, 50);
                }

                animateDashArray()
            })
            setMap(map);
        }
        return () => {
            window.clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        setSelectedCoordsInterval(coords);

    }, [coords]);

    useEffect(() => {
        if (mapObject) {
            mapObject.setCenter([coords[0].longitude, coords[0].latitude]);
            const source = mapObject.getSource('points');

            if (source) source.setData(
                coordsToGeoJsonPoints(coords)
            )
        }
    }, [deviceStore.currentDeviceIndex]);

    useEffect(() => {
        setCurrentPoint(0);
        if (mapObject) {
            selectedCoordsInterval && setDateStart(dayjs(selectedCoordsInterval.at(-1)?.date))
            selectedCoordsInterval && setDateEnd(dayjs(selectedCoordsInterval[0]?.date))
            selectedCoordsInterval.length && mapObject.setCenter([selectedCoordsInterval[0].longitude, selectedCoordsInterval[0].latitude]);
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
        if (mapObject && selectedCoordsInterval[currentPoint]) {
            mapObject.setCenter([selectedCoordsInterval[currentPoint].longitude, selectedCoordsInterval[currentPoint].latitude]);
        }
    }, [currentPoint]);

    const handleSetDateStart = (e: Dayjs | null) => {
        if (e) {
            let newDate = e;
            if (dayjs(e).isBefore(dayjs(gpsStore.minDate))) {
                newDate = dayjs(gpsStore.minDate);
                dateChangeAccept(newDate, null);
            }

            if (dayjs(e).isAfter(dateEnd)) {
                newDate = dateEnd;
                dateChangeAccept(newDate, null);
            }

            setDateStart(newDate);
        }
    }

    const handleSetDateEnd = (e: Dayjs | null) => {
        if (e) {
            let newDate = e;
            if (dayjs(e).isAfter(dayjs(gpsStore.maxDate))) {
                newDate = dayjs(gpsStore.maxDate);
                dateChangeAccept(null, newDate);
            }

            if (dayjs(e).isBefore(dateStart)) {
                newDate = dateStart;
                dateChangeAccept(null, newDate);
            }

            setDateEnd(newDate);
        }
    }

    const dateChangeAccept = (start, end) => {
        getLocations({device_id: deviceStore.currentDeviceIndex, date__from: start ? dayjs(start).format() : dayjs(dateStart).format(), date__till: end ? dayjs(end).format() : dayjs(dateEnd).format()});
    }

    const handleSelectMapType = (e: SelectChangeEvent<'streets-v12' | 'satellite-v9' | 'satellite-streets-v12'>) => {
        setMapStyle(e.target.value as MapType);
    }

    const handlePrevButtonClick = () => {
        if (currentPoint !== 0) {
            setCurrentPoint(prevState => prevState - 1);
        }
    }

    const handleNextButtonClick = () => {
        if (currentPoint !== selectedCoordsInterval.length - 1) {
            setCurrentPoint(prevState => prevState + 1);
        }
    }

    return (
        <div className={'widget-container2'}>
            <div ref={mapContainer} className={'map-container2'}>
                {!selectedCoordsInterval && 'Нет элементов для отображения'}
            </div>
            <div className={'controls-container2'}>
                <div className={'map-type-line2'}>
                    <label className={'map-type-label2'} htmlFor={'mapType'}>
                        Тип карты
                    </label>
                    <Select
                        className={'w-44 bg-white text-slate-700'}
                        id='mapType'
                        size={'small'}
                        value={mapStyle}
                        onChange={handleSelectMapType}
                    >
                        <MenuItem value={'streets-v12'}>Улицы</MenuItem>
                        <MenuItem value={'satellite-v9'}>Спутник</MenuItem>
                        <MenuItem value={'satellite-streets-v12'}>Гибрид</MenuItem>
                    </Select>
                </div>
                <div className={'interval-line2'}>
                    <p className={'interval-title2'}>Временной интервал</p>
                    <DateTimePicker
                        value={dateStart}
                        ampm={false}
                        onChange={handleSetDateStart}
                        onAccept={dateChangeAccept}
                        minDateTime={dayjs(toJS(gpsStore.minDate))}
                        maxDateTime={
                            dateEnd.isBefore(dayjs(toJS(gpsStore.maxDate)))
                                ? dateEnd
                                : dayjs(toJS(gpsStore.maxDate))
                        }
                        sx={{
                            width: '100%',
                            bgcolor: 'white',
                            '& .MuiInputBase-input': {paddingBlock: '10px'},
                        }}
                        label='Время начала'
                    />
                    <DateTimePicker
                        value={dateEnd}
                        ampm={false}
                        onChange={handleSetDateEnd}
                        onAccept={dateChangeAccept}
                        minDateTime={dateStart.isAfter(dayjs(toJS(gpsStore.minDate))) ? dateStart : dayjs(toJS(gpsStore.minDate))}
                        maxDateTime={dayjs(toJS(gpsStore.maxDate))}
                        sx={{width: '100%', bgcolor: 'white', '& .MuiInputBase-input': {paddingBlock: '10px'}}}
                        label='Время окончания'
                    />
                </div>
                <Box>
                    {selectedCoordsInterval.length ? <><Typography variant='body1' component='p' sx={{
                        fontSize: '1.125rem', lineHeight: '1.75rem',
                        fontWeight: '600',
                        color: '#334155'
                    }}>Текущая точка</Typography>
                        <Stack spacing={0.5} sx={{mt: '12px'}}>
                            <LabelAndText label="Дата" text={prettifyDate(selectedCoordsInterval[currentPoint].date)}
                                          variant='short_label'/>
                            <LabelAndText label="Широта" text={selectedCoordsInterval[currentPoint].latitude as string}
                                          variant='short_label'/>
                            <LabelAndText label="Долгота"
                                          text={selectedCoordsInterval[currentPoint].longitude as string}
                                          variant='short_label'/>
                        </Stack>
                        <Box sx={{display: 'flex', mt: '12px', justifyContent: 'center'}}>
                            <IconButton onClick={(e) => handlePrevButtonClick()} disabled={currentPoint === 0}>
                                <ArrowBackIosIcon color={'info'} sx={currentPoint === 0 ? {color: 'grey'} : {}}/>
                            </IconButton>
                            <IconButton onClick={(e) => handleNextButtonClick()}
                                        disabled={currentPoint === selectedCoordsInterval.length - 1}>
                                <ArrowForwardIosIcon color={'info'}
                                                     sx={currentPoint === selectedCoordsInterval.length - 1 ? {color: 'grey'} : {}}/>
                            </IconButton>
                        </Box> </> : <Typography variant='body1' component='p' sx={{
                        fontSize: '1.125rem', lineHeight: '1.75rem',
                        fontWeight: '600',
                        color: '#334155'
                    }}>Точек по запросу не найдено</Typography>}
                </Box>
            </div>
        </div>
    )
})
