import { LineChart } from '@components/line-chart';
import { BasePanel } from '@panels/base-panel';
import type { PanelProps } from '@context/panel-context/panels';
import { useComplexStore } from '@stores/complex-store';
import { useComplexData } from '@stores/devices-store';
import { ChartsFiltersForm } from '@forms/charts-filters-form';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { useCallback, useMemo, useState } from 'react';
import type { ChartsFiltersFormData } from '@forms/charts-filters-form/schema';
import { Guid } from 'typescript-guid';
import { IconButton } from '@components/icon-button';
import { useFocus } from '@hooks/use-focus';

export const ChartsPanel: React.FC<PanelProps<'charts'>> = () => {
    const { complex, measure } = useComplexStore();
    const { focusStation } = useFocus();
    const data = useComplexData();
    const [filters, setFilters] = useState<ChartsFiltersFormData>();

    const { mastId, stationId, deviceId } = useMemo(() => {
        const mastId =
            filters && Guid.isGuid(filters.mastId) ? Guid.parse(filters.mastId) : undefined;
        const stationId =
            filters && Guid.isGuid(filters.stationId) ? Guid.parse(filters.stationId) : undefined;
        return { mastId, stationId, deviceId: filters?.deviceId ?? '' };
    }, [filters]);

    const handleFocusClick = useCallback(() => {
        if (stationId && mastId) {
            focusStation(stationId, mastId);
        }
    }, [stationId, mastId]);

    return (
        <BasePanel
            panelId='charts'
            title='График'
            widthLimits={{ min: 400, max: null }}
            heightLimits={{ min: 400 }}
            noContent={{
                cond: () => !complex || !measure,
                label: 'Не установлен комплекс или параметр',
            }}>
            {complex && measure && (
                <>
                    <ComponentRowBox
                        left={[
                            <span>Параметр:</span>,
                            <EntityLabel entity={measure} type='measure' linkable />,
                        ]}
                        size='tiny'
                    />
                    {stationId && (
                        <ComponentRowBox
                            left={[
                                <span>Метеостанция:</span>,
                                <EntityLabel entity={{ id: stationId }} />,
                            ]}
                            right={[
                                <IconButton
                                    iconName='eye'
                                    title='Фокус'
                                    iconSize={16}
                                    onClick={handleFocusClick}
                                />,
                            ]}
                            size='tiny'
                        />
                    )}
                    <ChartsFiltersForm data={data} complex={complex} onFiltersChange={setFilters} />
                    {mastId && stationId && deviceId && (
                        <LineChart
                            measure={measure}
                            mastId={mastId}
                            stationId={stationId}
                            deviceId={deviceId}
                        />
                    )}
                </>
            )}
        </BasePanel>
    );
};
