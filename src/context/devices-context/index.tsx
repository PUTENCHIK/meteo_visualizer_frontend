// import { devicesStore, type DevicesStore } from '@stores/devices-store';
// import { createContext, useContext } from 'react';

// export const DevicesContext = createContext<DevicesStore | null>(null);

// export const DevicesProvider = ({ children }: { children: React.ReactNode }) => (
//     <DevicesContext.Provider value={devicesStore}>{children}</DevicesContext.Provider>
// );

// export const useDevicesStore = () => {
//     const context = useContext(DevicesContext);
//     if (!context) throw new Error('useDevices must be used within DevicesProvider');
//     return context;
// };
