import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { ComplexForm } from '@forms/complex-form';
import { useComplex } from '@hooks/complexes/use-complex';

export const EditComplexDialog: React.FC<DialogProps<'edit-complex'>> = ({ data }) => {
    const isUpdate = !!data?.complexId;

    const { data: complex, isLoading, isError } = useComplex(data?.complexId);

    return (
        <BaseDialog
            dialogId='edit-complex'
            title={
                isUpdate ? (
                    <>
                        <h2>Комплекс</h2>
                        {!!complex && <EntityLabel entity={complex} field='id' />}
                    </>
                ) : (
                    'Добавление комплекса'
                )
            }
            hardClose>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить комплекс</p>}
            {(!isUpdate || complex) && <ComplexForm complex={complex} />}
        </BaseDialog>
    );
};
