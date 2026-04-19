import clsx from 'clsx';
import s from './masts-panel.module.scss';
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
import { ComponentRowBox } from '@components/component-row-box';

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
            noContent={{
                cond: () => masts.length === 0,
                label: 'Нет ни одной мачты',
            }}
            buttons={[<Button title='Добавить мачту' type='primary' onClick={addMast} />]}>
            {masts.map((mast, index) => (
                <div key={index} className={clsx(s['mast-item'])}>
                    <ComponentRowBox
                        left={[
                            <h3>{index + 1}. Мачта</h3>,
                            <GuidLabel value={mast.id} objct='mast' />,
                        ]}
                        right={[
                            <IconButton
                                iconName='eye'
                                title='Фокус'
                                iconSize={20}
                                onClick={() => focusMast(mast.id)}
                            />,
                            <IconButton
                                iconName='bin'
                                title='Удалить'
                                iconSize={20}
                                onClick={() => deleteMast(mast.id)}
                            />,
                        ]}
                        size='tiny'
                    />
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
                    <InputLabel label='Положение' notLabel>
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
