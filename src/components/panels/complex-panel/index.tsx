import type { PanelProps } from '@context/panel-context/panels';
import { ComplexItem } from '@entity-items/complex-item';
import { BasePanel } from '@panels/base-panel';
import { useComplexStore } from '@stores/complex-store';

export const ComplexPanel: React.FC<PanelProps<'complex'>> = () => {
    const { complex } = useComplexStore();

    return (
        <BasePanel
            panelId='complex'
            title='Комплекс МАМКА'
            widthLimits={{ min: 300 }}
            noContent={{
                cond: () => !complex,
                label: <span>Комплекса нет в хранилище</span>,
            }}>
            {complex && <ComplexItem data={complex} focusable />}
        </BasePanel>
    );
};
