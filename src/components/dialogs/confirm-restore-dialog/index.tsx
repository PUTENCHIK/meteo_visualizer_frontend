import { Button } from '@components/button';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { useDialogs } from '@context/dialog-context';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { BaseForm } from '@forms/base-form';

export const ConfirmRestoreDialog: React.FC<DialogProps<'confirm-restore'>> = ({ data }) => {
    const { closeDialog } = useDialogs();
    const { extra, onSubmit } = data;

    const handleSubmit = async () => {
        await onSubmit();
        closeDialog();
    };

    return (
        <BaseDialog dialogId='confirm-restore' title='Восстановление'>
            <BaseForm
                buttons={[
                    <Button title='Отмена' onClick={closeDialog} />,
                    <Button title='Подтвердить' type='primary' actionType='submit' />,
                ]}
                onSubmit={handleSubmit}>
                <span>Вы точно хотите восстановить сущность?</span>
                {extra && (
                    <ComponentRowBox
                        left={[
                            <span>{extra.entityName}:</span>,
                            <EntityLabel entity={extra.entity} size='big' />,
                        ]}
                        size='tiny'
                    />
                )}
            </BaseForm>
        </BaseDialog>
    );
};
