// @ts-nocheck
import * as React from 'react';
import {LineChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend, Line} from 'recharts';
import Title from './Title';
import deviceStore from "../stores/deviceStore";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

const Chart = () => {
    const chartData = toJS(deviceStore.currentDeviceBatteryData).map(data => ({...data, timestamp: new Date(data.timestamp).getTime()}));

    return (
        <Box sx={{minWidth: '50%', maxWidth: '50%', maxHeight: '210px', mr: '12px'}}>
            <Title>Потребление батареи</Title>
            <ResponsiveContainer>
                <LineChart data={chartData}
                           margin={{
                               top: 20,
                               right: 20,
                               bottom: 20,
                               left: 20,
                           }}
                >
                    <CartesianGrid/>
                    <XAxis dataKey="timestamp" type='number' name="Date" allowDuplicatedCategories={false}
                           tickFormatter={(timestamp) => `${dayjs(timestamp).format('DD.MM')}`}
                           domain={['auto', 'auto']}/>
                    <YAxis dataKey="battery_lvl" name="Battery" unit="%"/>
                    <Tooltip cursor={{strokeDasharray: '3 3'}} formatter={(item, name) => {
                        return item;
                    }} labelFormatter={(item) => new Date(item)}/>
                    <Legend/>
                    <Line type="monotone" dataKey="battery_lvl" stroke="#8884d8" fill="#8884d8"/>
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default observer(Chart);
