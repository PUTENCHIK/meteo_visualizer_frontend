import { ComplexPanel } from '@panels/complex-panel';
import type { PanelId } from '.';
import type { PanelPayloads } from './payloads';
import { WebsocketApiPanel } from '@panels/websocket-api-panel';
import { ChartsPanel } from '@panels/charts-panel';

export interface PanelProps<K extends PanelId> {
    data: PanelPayloads[K];
}

export const panelComponents: { [K in PanelId]: React.FC<any> } = {
    complex: ComplexPanel,
    websocketApi: WebsocketApiPanel,
    charts: ChartsPanel,
};
