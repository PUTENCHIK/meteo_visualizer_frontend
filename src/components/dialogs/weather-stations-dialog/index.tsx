import clsx from 'clsx';
import s from './weather-stations-dialog.module.scss';
import sBoxes from '@styles/item-boxes.module.scss';
import { GuidLabel } from '@components/guid-label';
import { IconButton } from '@components/icon-button';
import { useComplexData } from '@context/complex-data-context';
import { DialogWindow } from '@dialogs/dialog-window';
import { useFocus } from '@hooks/use-focus';

export const WeatherStationsDialog = () => {
    const { stations } = useComplexData();
    const { focusObject } = useFocus();

    return (
        <DialogWindow title='Метеостанции' dialogId='weatherStations'>
            {stations.length === 0 && (
                <div className={clsx(sBoxes['empty-label-wrapper'])}>
                    <span className={clsx(sBoxes['empty-label'])}>Добавьте первую мачту</span>
                </div>
            )}
            {stations.map((station, index) => (
                <div key={index} className={clsx(s['station-item'])}>
                    <div className={clsx(sBoxes['header'])}>
                        <div className={clsx(sBoxes['group'])}>
                            <span className={clsx(sBoxes['number'])}>{index + 1}. Станция</span>
                            <GuidLabel value={station.id} objct='station' />
                        </div>
                        <div className={clsx(sBoxes['group'])}>
                            <IconButton
                                iconName='eye'
                                title='Фокус'
                                iconSize={20}
                                onClick={() => focusObject(station.id)}
                            />
                        </div>
                    </div>
                    <div className={clsx(sBoxes['group'])}>
                        <span>Мачта:</span>
                        <GuidLabel value={station.mastId} objct='mast' />
                    </div>
                    <span>
                        Высота: {station.yardHeight}м; Номер: {station.num}
                    </span>
                    <span className={clsx(s['wrapable'])}>Обозначение: {station.name ?? '-'}</span>
                </div>
            ))}
        </DialogWindow>
    );
};
