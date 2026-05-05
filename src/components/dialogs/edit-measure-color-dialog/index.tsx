import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { MeasureColorForm } from '@forms/measure-color-form';
import { useMeasureColor } from '@hooks/measure-colors/use-measure-color';

export const EditMeasureColorDialog: React.FC<DialogProps<'edit-measure-color'>> = ({ data }) => {
    const isUpdate = !!data?.colorId;

    const { data: color, isLoading, isError } = useMeasureColor(data?.colorId);

    return (
        <BaseDialog
            dialogId='edit-measure-color'
            title={
                isUpdate ? (
                    <>
                        <h2>Цвет параметра</h2>
                        {!!color && <EntityLabel entity={color} field='id' />}
                    </>
                ) : (
                    'Добавление цвета'
                )
            }
            hardClose>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить цвет параметра</p>}
            {(!isUpdate || color) && <MeasureColorForm measure={data.measure} color={color} />}
        </BaseDialog>
    );
};
