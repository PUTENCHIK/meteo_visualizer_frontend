import clsx from 'clsx';
import s from './masts-panel.module.scss';
import sBoxes from '@styles/item-boxes.module.scss';
import { BasePanel } from '@panels/base-panel';
import { PolarSystemInput } from '@components/polar-system-input';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import { NumberInput } from '@components/number-input';
import { Mast, mastConfigs } from '@utils/complexes';
import { GuidLabel } from '@components/guid-label';
import { IconButton } from '@components/icon-button';
import { Button } from '@components/button';
import { useFocus } from '@hooks/use-focus';
import { useComplexStore } from '@stores/complex-store';
import { PolarPosition } from '@utils/coordinate-systems';
import { Select } from '@components/select';

export const MastsPanel = () => {
    const { focusMast } = useFocus();
    const masts = useComplexStore((state) => state.masts);
    const addMast = useComplexStore((state) => state.addMast);
    const updateMast = useComplexStore((state) => state.updateMast);
    const deleteMast = useComplexStore((state) => state.deleteMast);

    return (
        <BasePanel
            title='Мачты'
            panelId='masts'
            widthLimits={{ min: 300 }}
            buttons={[<Button title='Добавить мачту' type='primary' onClick={addMast} />]}>
            {masts.length === 0 && (
                <div className={clsx(sBoxes['empty-label-wrapper'])}>
                    <span className={clsx(sBoxes['empty-label'])}>Нет ни одной мачты</span>
                </div>
            )}
            {masts.map((mast, index) => (
                <div key={index} className={clsx(s['mast-item'])}>
                    <div className={clsx(sBoxes['header'])}>
                        <div className={clsx(sBoxes['group'])}>
                            <span className={clsx(sBoxes['number'])}>{index + 1}. Мачта</span>
                            <GuidLabel value={mast.id} objct='mast' />
                        </div>
                        <div className={clsx(sBoxes['group'])}>
                            <IconButton
                                iconName='eye'
                                title='Фокус'
                                iconSize={20}
                                onClick={() => focusMast(mast.id)}
                            />
                            <IconButton
                                iconName='bin'
                                title='Удалить'
                                iconSize={20}
                                onClick={() => deleteMast(mast.id)}
                            />
                        </div>
                    </div>
                    <InputLabel label='Префикс'>
                        <TextInput
                            defaultValue={mast.prefix}
                            placeholder='west/north'
                            onBlur={(value) => updateMast(mast.id, { prefix: value })}
                        />
                    </InputLabel>
                    <InputLabel label='Описание'>
                        <TextInput
                            defaultValue={mast.description}
                            placeholder='Описание'
                            onBlur={(value) => updateMast(mast.id, { description: value })}
                        />
                    </InputLabel>
                    <InputLabel label='Положение'>
                        <PolarSystemInput
                            value={mast.position}
                            maxRadius={Mast.MAX_POS_RADIUS}
                            onChange={(value) =>
                                updateMast(mast.id, {
                                    position: new PolarPosition(value.radius, value.angle),
                                })
                            }
                        />
                    </InputLabel>
                    <InputLabel label='Угол поворота'>
                        <NumberInput
                            defaultValue={mast.rotation ?? 0}
                            postfix='°'
                            onChange={(value) => updateMast(mast.id, { rotation: value })}
                        />
                    </InputLabel>
                    <InputLabel label='Конфиг'>
                        <Select
                            defaultValue={mast.configName}
                            options={mastConfigs.map((config) => config.name)}
                            onChange={(value) =>
                                updateMast(mast.id, {
                                    configName: value,
                                })
                            }
                        />
                    </InputLabel>
                </div>
            ))}
        </BasePanel>
    );
};
