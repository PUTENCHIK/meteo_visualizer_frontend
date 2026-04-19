import clsx from 'clsx';
import s from './confirm-delete-dialog.module.scss';
import { useState } from 'react';
import { Button } from '@components/button';
import { EntityLabel } from '@components/entity-label';
import { InputLabel } from '@components/input-label';
import { useDialogs } from '@context/dialog-context';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { BaseForm } from '@forms/base-form';
import { ComponentRowBox } from '@components/component-row-box';

export type DeleteMode = 'soft' | 'hard' | 'both';

export const ConfirmDeleteDialog: React.FC<DialogProps<'confirm-delete'>> = ({ data }) => {
    const { closeDialog } = useDialogs();
    const { mode, onSubmit, extra } = data;
    const [force, setForce] = useState(mode === 'hard');

    const handleSubmit = async () => {
        await onSubmit(force);
        closeDialog();
    };

    return (
        <BaseDialog dialogId='confirm-delete' title='Удаление'>
            <BaseForm
                buttons={[
                    <Button title='Отмена' onClick={closeDialog} />,
                    <Button title='Подтвердить' type='danger' actionType='submit' />,
                ]}
                onSubmit={handleSubmit}>
                <span>Вы точно хотите удалить?</span>
                {extra ? (
                    <ComponentRowBox
                        left={[
                            <span>{extra.entityName}:</span>,
                            <EntityLabel entity={extra.entity} size='big' />,
                        ]}
                        size='tiny'
                    />
                ) : (
                    <></>
                )}
                {mode === 'both' && (
                    <InputLabel label='Жёсткое удаление' orientation='horizontal'>
                        <input
                            type='checkbox'
                            checked={force}
                            onChange={(e) => setForce(e.target.checked)}
                        />
                    </InputLabel>
                )}
                {force && (
                    <span className={clsx(s['warning'])}>
                        Эту операцию будет невозможно отменить
                    </span>
                )}
            </BaseForm>
        </BaseDialog>
    );
};
