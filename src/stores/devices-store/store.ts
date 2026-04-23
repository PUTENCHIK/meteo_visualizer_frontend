// import type { PollResult } from '@context/websocket-context';
// import { storageManager } from '@managers/local-storage-manager';
// // import { useComplexStore } from '@stores/complex-store';
// import {
//     measures,
//     WeatherDevice,
//     WeatherStation,
//     type VisualizationData,
//     type DeviceMeasurement,
// } from '@utils/complexes';
// import throttle from 'lodash.throttle';
// import type { DevicesData } from './types';

// export class DevicesStore {
//     private EMIT_FREQUENCY = 300;
//     private _data: DevicesData = {};
//     private _listeners = new Set<(data: DevicesData) => void>();
//     private _measure: keyof typeof measures;

//     constructor() {
//         this._measure = storageManager.getItem('measure');
//     }

//     private _emitChange = () => {
//         this._listeners.forEach((l) => l(this.data));
//     };

//     private throttledEmitChange = throttle(this._emitChange, this.EMIT_FREQUENCY);

//     public addData = (name: string, pollResult: PollResult) => {
//         const deviceName = WeatherDevice.parseName(name);
//         if (!deviceName) {
//             return;
//         }

//         const station = WeatherStation.getByDeviceName(deviceName);
//         if (!station) {
//             return;
//         }

//         const currentDevices = this.data[station.id.toString()] || [];

//         this.data[station.id.toString()] = currentDevices.map((d) => d);

//         const targetDeviceName = WeatherDevice.getNameFromParsed(deviceName);
//         const devices = this._data[station.id.toString()];
//         let device = devices.find((d) => d.fullName === targetDeviceName);
//         if (!device) {
//             device = new WeatherDevice(deviceName, station.id);
//             this._data[station.id.toString()] = [...devices, device];
//         }

//         for (const payloadItem of pollResult.payload) {
//             if (!device.data[payloadItem.name])
//                 device.data[payloadItem.name] = {
//                     units: payloadItem.units,
//                     measurements: [],
//                 };

//             const measurements = device.data[payloadItem.name].measurements;
//             device.data[payloadItem.name].measurements = [
//                 ...measurements,
//                 {
//                     value: payloadItem.value,
//                     timestamp: pollResult.timestamp,
//                 },
//             ];

//             if (device.data[payloadItem.name].measurements.length > 150) {
//                 device.data[payloadItem.name].measurements.shift();
//             }
//         }

//         this._data = { ...this._data };

//         this.throttledEmitChange();
//     };

//     public subscribe = (callback: (data: DevicesData) => void) => {
//         this._listeners.add(callback);
//         return () => this._listeners.delete(callback);
//     };

//     get data() {
//         return this._data;
//     }

//     get measure() {
//         return this._measure;
//     }

//     set measure(value: keyof typeof measures) {
//         this._measure = value;
//         storageManager.setItem('measure', value);
//         this.throttledEmitChange();
//     }

//     public getAtmosphereData(): Record<string, VisualizationData> {
//         // const keys: readonly string[] = measures[this._measure];
//         // const positions = useComplexStore.getState().stationsPositions;
//         const result: Record<string, VisualizationData> = {};

//         // for (const stationId in this._data) {
//         //     const devices = this._data[stationId];
//         //     const position = positions[stationId];
//         //     if (!position) continue;

//         //     for (const device of devices) {
//         //         for (const measure in device.data) {
//         //             const measureData = device.data[measure];
//         //             if (keys.includes(measure)) {
//         //                 const lastMeasurement = measureData.measurements.at(-1);
//         //                 if (lastMeasurement) {
//         //                     result[`${stationId}:${device.fullName}`] = {
//         //                         position: position,
//         //                         value: lastMeasurement.value,
//         //                     };
//         //                 }
//         //             }
//         //         }
//         //     }
//         // }

//         return result;
//     }

//     public getChartData(deviceName: string, measure: string): DeviceMeasurement[] {
//         for (const stationId in this._data) {
//             const devices = this._data[stationId];
//             for (const device of devices) {
//                 if (device.fullName === deviceName) {
//                     for (const measureName in device.data) {
//                         if (measureName === measure) {
//                             const measure = device.data[measureName];
//                             return measure.measurements;
//                         }
//                     }
//                     return [];
//                 }
//             }
//         }
//         return [];
//     }
// }

// export const devicesStore = new DevicesStore();
