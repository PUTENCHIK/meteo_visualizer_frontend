import { useDialogs } from '@context/dialog-context';
import { dialogComponents, type DialogProps } from '@context/dialog-context/dialogs';

export const DialogsBox = () => {
    const { activeDialogs } = useDialogs();

    return (
        <>
            {activeDialogs.map((dialog, index) => {
                const Component = dialogComponents[dialog.id] as React.FC<DialogProps<any>>;
                if (!Component) return null;

                return (
                    <Component
                        key={`${dialog.id}-${index}`}
                        data={dialog.data}
                    />
                );
            })}
        </>
    );
};
