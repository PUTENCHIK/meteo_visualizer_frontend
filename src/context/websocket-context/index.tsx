import { useDevicesStore } from '@context/devices-context';
import { storageManager } from '@managers/local-storage-manager';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

type PollStatus = 'DONE' | 'ERROR' | 'DEACTIVATED' | 'CONNECTION_FAILURE';

interface PayloadItem {
    description: string;
    name: string;
    units: string;
    value: number;
}

interface DebugInfo {
    poll_start_time: number;
    poll_end_time: number;
}

export interface PollResult {
    timestamp: number;
    payload: PayloadItem[];
    status: PollStatus;
    debug_info: DebugInfo;
}

interface ServerMessage {
    pollable_name: string;
    pipelines: string[];
    poll_result: PollResult | null;
}

export interface SocketConfig {
    host: string;
    port: number;
}

interface SocketContextType {
    sendMessage: (data: any) => void;
    readyState: ReadyState;
    connectionEnabled: boolean;
    isConnecting: boolean;
    isConnected: boolean;
    toggleConnection: () => void;
    config: SocketConfig;
    updateConfig: (host: string, port: number) => void;
    socketUrl: string;
    messagesCount: number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { addData } = useDevicesStore();

    const [connectionEnabled, setConnectionEnabled] = useState(false);
    const [config, setConfig] = useState<SocketConfig>(storageManager.getItem('socketContext'));

    const messagesCountRef = useRef<number>(0);
    const [messagesCount, setMessagesCount] = useState<number>(0);

    const getSocketUrl = useCallback(
        () => `ws://${config.host}:${config.port}/ws`,
        [config.host, config.port],
    );

    const socketUrl = useMemo(
        () => (connectionEnabled ? getSocketUrl() : null),
        [connectionEnabled, getSocketUrl],
    );

    const { sendJsonMessage, readyState } = useWebSocket<ServerMessage>(socketUrl, {
        onMessage: (event) => {
            try {
                const message: ServerMessage = JSON.parse(event.data);
                if (message.poll_result) {
                    addData(message.pollable_name, message.poll_result);
                }
                messagesCountRef.current += 1;
            } catch (error) {
                console.error(`Parsing error: ${error}`);
            }
        },
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        share: true,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMessagesCount(messagesCountRef.current);
            messagesCountRef.current = 0;
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const isConnected = connectionEnabled && readyState === ReadyState.OPEN;
    const isConnecting =
        connectionEnabled && !isConnected && readyState !== ReadyState.UNINSTANTIATED;

    const updateConfig = (host: string, port: number) => {
        const newConfig = { host, port };
        setConfig(newConfig);
        storageManager.setItem('socketContext', newConfig);
    };

    const contextValue = useMemo(
        () => ({
            sendMessage: sendJsonMessage,
            readyState,
            connectionEnabled,
            isConnecting,
            isConnected,
            toggleConnection: () => setConnectionEnabled((prev) => !prev),
            config,
            updateConfig: updateConfig,
            socketUrl: getSocketUrl(),
            messagesCount: messagesCount,
        }),
        [
            sendJsonMessage,
            readyState,
            connectionEnabled,
            isConnecting,
            isConnected,
            config,
            getSocketUrl,
            messagesCount,
        ],
    );

    return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket must be used within SocketProvider');
    return context;
};
