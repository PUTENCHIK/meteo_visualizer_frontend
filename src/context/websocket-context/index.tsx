import { showError } from '@components/toast/funcs';
import { useAuthStore } from '@stores/auth-store';
import api from '@stores/auth-store/api';
import { useComplexStore } from '@stores/complex-store';
import type { MessagePayloadSchema } from '@utils/schemas/websocket';
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
import { devicesStore } from '@stores/devices-store';

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
    const { complex, measure } = useComplexStore();
    const { logout } = useAuthStore();

    const [connectionEnabled, setConnectionEnabled] = useState(false);

    const messagesCountRef = useRef<number>(0);
    const [messagesCount, setMessagesCount] = useState<number>(0);

    const reconnectRef = useRef<boolean>(false);

    const getSocketUrl = useCallback(async (): Promise<string> => {
        if (!complex || !measure) return '';

        if (reconnectRef.current) {
            try {
                await api.get('/users/status');
                reconnectRef.current = false;
            } catch (error) {
                await logout();
                showError({ error: error as Error });
                window.location.href = '/auth';
                throw error;
            }
        }

        const { accessToken } = useAuthStore.getState();
        return `ws://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/complexes/${complex.id}/ws?token=${accessToken}&measure_id=${measure.id}`;
    }, [complex, measure, logout]);

    const socketUrl = useMemo(() => {
        if (!connectionEnabled || !complex) return null;
        return getSocketUrl;
    }, [connectionEnabled, getSocketUrl, complex]);

    const { sendJsonMessage, readyState } = useWebSocket<MessagePayloadSchema>(socketUrl, {
        onOpen: () => {
            devicesStore.clearData();
        },
        onMessage: (event) => {
            try {
                const message: MessagePayloadSchema = JSON.parse(event.data);
                devicesStore.addData(message);
                messagesCountRef.current += 1;
            } catch (error) {
                showError({ error: error as Error });
            }
        },
        onClose: (event) => {
            if (event.code === 4001) {
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
        [sendJsonMessage, readyState, connectionEnabled, isConnecting, isConnected, messagesCount],
    );

    return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket must be used within SocketProvider');
    return context;
};
