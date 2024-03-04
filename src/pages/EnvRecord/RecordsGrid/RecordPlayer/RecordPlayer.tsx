// @ts-nocheck
import React, {useCallback, useEffect, useRef, useState} from 'react';
import WaveSurfer from "wavesurfer.js";
import {observer} from "mobx-react-lite";
import {Box} from "@mui/material";
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import Tooltip from "@mui/material/Tooltip";
import microStore from "../../../../stores/microStore";


const useWavesurfer = (containerRef, options) => {
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,
        })

        setWavesurfer(ws)

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return wavesurfer
}

const RecordPlayer = (props) => {
    const containerRef = useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const wavesurfer = useWavesurfer(containerRef, props)
    const {width} = props;

    // On play button click
    const onPlayClick = useCallback(() => {
        microStore.waveforms.forEach(wave => {
            wave.pause();
        })

        wavesurfer.play()
    }, [wavesurfer])

    const onPauseClick = useCallback(() => {
        microStore.waveforms.forEach(wave => {
            wave.pause();
        })

    }, [wavesurfer])

    useEffect(() => {
        if (!wavesurfer) return

        setCurrentTime(0)
        setIsPlaying(false)

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
            wavesurfer.on('ready', () => onPlayClick()),
        ]

        microStore.addWaveform(wavesurfer);

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])

    return (
        <Box sx={{display: 'flex',}}>
            <button onClick={isPlaying ? onPauseClick : onPlayClick} style={{minWidth: '30px', textAlign: "left"}}>
                {isPlaying ? <Tooltip title='Пауза'><PauseCircleIcon color={'info'}/></Tooltip> :
                    <Tooltip title='Прослушать'><PlayCircleIcon color={'info'}/></Tooltip>}
            </button>
            <div ref={containerRef} style={{minHeight: '60px', width: width, marginLeft: '8px'}}/>
            {/*<p>Seconds played: {currentTime}</p>*/}
        </Box>
    )
};

export default observer(RecordPlayer);
