import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { MeasureForm } from '@forms/measure-form';
import { useMeasure } from '@hooks/measures/use-measure';

export const EditMeasureDialog: React.FC<DialogProps<'edit-measure'>> = ({ data }) => {
    const isUpdate = !!data?.measureId;

    const { data: measure, isLoading, isError } = useMeasure(data?.measureId);

    return (
        <BaseDialog
            dialogId='edit-measure'
            title={
                isUpdate ? (
                    <>
                        <h2>Параметр</h2>
                        {!!measure && <EntityLabel entity={measure} field='id' />}
                    </>
                ) : (
                    'Добавление параметра'
                )
            }
            hardClose>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить параметр</p>}
            {(!isUpdate || measure) && <MeasureForm measure={measure} />}
        </BaseDialog>
    );
};
