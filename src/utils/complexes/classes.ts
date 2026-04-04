import { v5 as uuidv5 } from 'uuid';
import { PolarPosition } from '@utils/coordinate-systems';
import { Guid } from 'typescript-guid';
import type { MastDto, WeatherDeviceName } from './interfaces';
import { mastConfigs } from './consts';
import type {
    MastConfigName,
    DeviceData,
    WeatherStationsAmount,
    WeatherStationsNum,
} from './types';
import { useComplexStore } from '@stores/complex-store';
import { joinWithSeparator } from '@utils/common';

export class WeatherDevice {
    public parsedName: WeatherDeviceName;
    public data: DeviceData;
    public stationId: Guid;

    constructor(parsedName: WeatherDeviceName, stationId: Guid) {
        this.parsedName = parsedName;
        this.data = {};
        this.stationId = stationId;
    }

    get station(): WeatherStation | undefined {
        return useComplexStore.getState().getStation(this.stationId);
    }

    get name(): string {
        return joinWithSeparator([this.parsedName.name, this.parsedName.postfix]);
    }

    get fullName(): string {
        return WeatherDevice.getNameFromParsed(this.parsedName);
    }

    static getNameFromParsed(name: WeatherDeviceName): string {
        return joinWithSeparator([
            name.mast,
            `L${name.yard}`,
            `N${name.num}`,
            name.name,
            name.postfix,
        ]);
    }

    static parseName(sourceName: string): WeatherDeviceName | undefined {
        const parts = sourceName.split('-');

        let prefix: string | undefined;
        let yard: number | undefined;
        let num: WeatherStationsNum | undefined;
        let name: string | undefined;
        let postfix: string | undefined;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (i === 0) {
                prefix = part.toLowerCase();
            } else if (i === 1 && part.startsWith('L')) {
                yard = Number(part.slice(1));
            } else if (i === 2) {
                if (part.startsWith('N') && part.length === 2) {
                    num = Number(part.slice(1)) as WeatherStationsNum;
                } else {
                    num = 1;
                    name = part;
                }
            } else {
                if (name) {
                    postfix = parts.slice(i).join('-');
                } else {
                    name = part;
                }
            }
        }

        return prefix && yard && num && name
            ? {
                  mast: prefix,
                  yard: yard,
                  num: num,
                  name: name,
                  postfix: postfix,
              }
            : undefined;
    }
}

export class WeatherStation {
    public id: Guid;
    public mastId: Guid;
    public height: number;
    public num: WeatherStationsNum;

    static IDKEY = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

    constructor(mastId: Guid, height: number, num: WeatherStationsNum) {
        this.id = WeatherStation.generateId(mastId, height, num);
        this.mastId = mastId;
        this.height = height;
        this.num = num;
    }

    static generateId(mastId: Guid, height: number, num: WeatherStationsNum): Guid {
        return Guid.parse(uuidv5(`${mastId.toString()}:${height}:${num}`, WeatherStation.IDKEY));
    }

    static get(mastId: Guid, height: number, num: WeatherStationsNum): WeatherStation | undefined {
        const state = useComplexStore.getState();
        return state.masts
            .find((m) => m.id === mastId)
            ?.stations.find((s) => s.height === height && s.num === num);
    }

    static getByDeviceName(deviceName: WeatherDeviceName): WeatherStation | undefined {
        const mast = useComplexStore.getState().getMastByPrefix(deviceName.mast);
        if (!mast) {
            return undefined;
        }
        const yard = mast.config.yards.find((_, i) => i + 1 === deviceName.yard);
        if (!yard) {
            return undefined;
        }
        return WeatherStation.get(mast.id, yard.height, deviceName.num);
    }
}

export class Yard {
    public height: number;
    public amount: WeatherStationsAmount;

    constructor(height: number, amount: WeatherStationsAmount) {
        this.height = height;
        this.amount = amount;
    }
}

export class MastConfig<T extends string = string> {
    public name: T;
    public height: number;
    public yards: Yard[];

    constructor(name: T, height: number, yards: Yard[]) {
        this.name = name;
        this.height = height;
        this.yards = yards;
    }
}

export class Mast {
    public id: Guid;
    public prefix: string;
    public description: string;
    public rotation: number;
    public stations: WeatherStation[];

    private _position: PolarPosition = new PolarPosition();
    private _configName: MastConfigName;

    public static MAX_POS_RADIUS = 500;

    constructor(
        prefix: string,
        position: PolarPosition,
        rotation?: number,
        description?: string,
        configName?: MastConfigName,
        idFromDto?: Guid,
    ) {
        this.id = idFromDto ?? Guid.create();
        this.prefix = prefix;
        this.position = position;
        this.description = description ?? '';
        this.rotation = rotation ?? 0;
        this._configName = configName ?? '35m, 4 stations';

        this.stations = this.createStations();
    }

    get configName(): MastConfigName {
        return this._configName;
    }

    set configName(value: MastConfigName) {
        if (value === this._configName) return;

        this._configName = value;
        this.stations = this.createStations();
    }

    get config(): MastConfig {
        return mastConfigs.find((c) => c.name == this.configName)!;
    }

    get height(): number {
        return this.config.height;
    }

    get position(): PolarPosition {
        return this._position;
    }

    set position(value: PolarPosition) {
        value.radius = Math.max(0, value.radius);
        value.radius = Math.min(value.radius, Mast.MAX_POS_RADIUS);
        this._position = value;
    }

    public toJSON(): MastDto {
        return {
            id: { value: this.id.toString() },
            prefix: this.prefix,
            description: this.description,
            position: this.position.toJSON(),
            rotation: this.rotation,
            _configName: this._configName,
        };
    }

    static fromJSON(data: MastDto): Mast {
        return new Mast(
            data.prefix,
            PolarPosition.fromJSON(data.position),
            data.rotation,
            data.description,
            data._configName,
            Guid.parse(data.id.value),
        );
    }

    private createStations(): WeatherStation[] {
        return this.config.yards.flatMap((yard) => {
            const createStation = (num: WeatherStationsNum) =>
                new WeatherStation(this.id, yard.height, num);
            return yard.amount === 1
                ? createStation(1)
                : [createStation(1), createStation(2), createStation(3)];
        });
    }
}
