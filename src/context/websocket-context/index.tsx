// import { useDevicesStore } from '@context/devices-context';
import { showError } from '@components/toast/funcs';
import { useAuthStore } from '@stores/auth-store';
import api from '@stores/auth-store/api';
import { useComplexStore } from '@stores/complex-store';
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
    disableConnection: () => void;
    messagesCount: number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    // const { addData } = useDevicesStore();
    const { complex } = useComplexStore();
    const { logout } = useAuthStore();

    const [connectionEnabled, setConnectionEnabled] = useState(false);

    const messagesCountRef = useRef<number>(0);
    const [messagesCount, setMessagesCount] = useState<number>(0);

    const reconnectRef = useRef<boolean>(false);

    const getSocketUrl = useCallback(
        async (): Promise<string> => {
            if (!complex) return '';

            if (reconnectRef.current) {
                try {
                    await api.get('/users/status');
                    reconnectRef.current = false;
                } catch (error) {
                    await logout();
                    showError({error: error as Error});
                    window.location.href = '/auth';
                    throw error;
                }
            }

            const { accessToken } = useAuthStore.getState();
            return `ws://localhost:5049/api/complexes/${complex.id}/ws?token=${accessToken}`;
        },
        [complex],
    );

    const socketUrl = useMemo(() => {
        if (!connectionEnabled || !complex) return null;
        return getSocketUrl;
    }, [connectionEnabled, getSocketUrl, complex]);

    const { sendJsonMessage, readyState } = useWebSocket<ServerMessage>(socketUrl, {
        onMessage: (event) => {
            try {
                const message: ServerMessage = JSON.parse(event.data);
                if (message.poll_result) {
                    // addData(message.pollable_name, message.poll_result);
                    console.log(message.pollable_name);
                }
                messagesCountRef.current += 1;
            } catch (error) {
                showError({ error: error as Error });
            }
        },
        onClose: (event) => {
            if (event.code === 4001) {
                console.log(4001);
                
                reconnectRef.current = true;
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

    const contextValue = useMemo(
        () => ({
            sendMessage: sendJsonMessage,
            readyState,
            connectionEnabled,
            isConnecting,
            isConnected,
            toggleConnection: () => setConnectionEnabled((prev) => !prev),
            disableConnection: () => setConnectionEnabled(false),
            messagesCount: messagesCount,
        }),
        [
            sendJsonMessage,
            readyState,
            connectionEnabled,
            isConnecting,
            isConnected,
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
