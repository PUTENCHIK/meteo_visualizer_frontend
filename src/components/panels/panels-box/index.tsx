import { usePanels } from '@context/panel-context';
import { panelComponents, type PanelProps } from '@context/panel-context/panels';

export const PanelsBox = () => {
    const { activePanels } = usePanels();

    return (
        <>
            {activePanels.map((panel) => {
                const Component = panelComponents[panel.id] as React.FC<PanelProps<any>>;
                if (!Component) return null;

                return <Component key={panel.id} data={panel.data} />;
            })}
        </>
    );
};
