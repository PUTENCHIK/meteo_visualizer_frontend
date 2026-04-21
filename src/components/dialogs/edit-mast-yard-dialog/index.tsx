import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { MastYardForm } from '@forms/mast-yard-form';
import { useMastYard } from '@hooks/mast-yards/use-mast-yard';

export const EditMastYardDialog: React.FC<DialogProps<'edit-mast-yard'>> = ({ data }) => {
    const isUpdate = !!data?.mastYardId;

    const { data: yard, isLoading, isError } = useMastYard(data?.mastYardId);

    return (
        <BaseDialog
            dialogId='edit-mast-yard'
            title={
                isUpdate ? (
                    <>
                        <h2>Рея мачты</h2>
                        {!!yard && <EntityLabel entity={yard} />}
                    </>
                ) : (
                    'Добавление реи мачты'
                )
            }
            hardClose>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить рею мачты</p>}
            {(!isUpdate || yard) && <MastYardForm config={data.config} yard={yard} />}
        </BaseDialog>
    );
};
