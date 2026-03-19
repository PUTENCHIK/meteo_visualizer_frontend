import { FastLineChart } from '@components/line-chart';
import { useComplexData } from '@context/complex-data-context';
import { DialogWindow } from '@dialogs/dialog-window';
import { useState } from 'react';

export const ChartsDialog = () => {
    const { stationsName } = useComplexData();

    const [currentStation, setCurrentStation] = useState<string | undefined>(undefined);

    return (
        <DialogWindow dialogId='charts' title='График' widthLimits={{ min: 300, max: null }}>
            <select onChange={(event) => setCurrentStation(event.target.value)}>
                <option value={undefined}>-</option>
                {stationsName.sort().map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>

            <FastLineChart currentStation={currentStation} />
        </DialogWindow>
    );
};
