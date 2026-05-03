import { TabsMenu } from '@components/tabs-menu';
import type { PanelProps } from '@context/panel-context/panels';
import { ComplexItem } from '@entity-items/complex-item';
import { MastItem } from '@entity-items/mast-item';
import { BasePanel } from '@panels/base-panel';
import { useComplexStore } from '@stores/complex-store';
import { useDevicesData } from '@stores/devices-store';
import type { MastSchema } from '@utils/schemas';
import { useMemo, useState } from 'react';

export const ComplexPanel: React.FC<PanelProps<'complex'>> = () => {
    const tabs = {
        complex: 'Комплекс и мачты',
        devices: 'Датчики',
    };
    const [currentTab, setCurrentTab] = useState<keyof typeof tabs>('complex');
    const { complex } = useComplexStore();
    const data = useDevicesData();

    const masts: Record<string, MastSchema> = useMemo(
        () => Object.fromEntries(complex?.masts.map((mast) => [mast.id.toString(), mast]) ?? []),
        [complex],
    );

    const devicesData = Object.entries(data);

    return (
        <BasePanel
            panelId='complex'
            title='Комплекс МАМКА'
            widthLimits={{ min: 300 }}
            noContent={{
                cond: () => !complex,
                label: <span>Комплекса нет в хранилище</span>,
            }}>
            <TabsMenu current={currentTab} tabs={tabs} onChange={setCurrentTab} />
            {complex && (
                <>
                    {currentTab === 'complex' && <ComplexItem data={complex} focusable />}
                    {currentTab === 'devices' && devicesData.length > 0 ? (
                        devicesData.map(([mastId, mastData], index) => {
                            const mast = masts[mastId];

                            return (
                                mast && (
                                    <MastItem
                                        key={index}
                                        mast={mast}
                                        complex={complex}
                                        data={mastData}
                                        focusable
                                    />
                                )
                            );
                        })
                    ) : (
                        <span>Измерений датчиков нет</span>
                    )}
                </>
            )}
        </BasePanel>
    );
};
