export interface PayloadItem {
    description: string | null;
    name: string;
    units: string | null;
    value: number;
}

export interface PollableNameSchema {
    pollable_name: string;
}

export interface WeatherDeviceName {
    mast: string;
    yard: number;
    num: number;
    name: string;
    postfix: string | null;
}

export interface MessagePayloadSchema extends PollableNameSchema {
    device_name: WeatherDeviceName;
    timestamp: number;
    items: PayloadItem[];
}
