import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { MeasureAliasForm } from '@forms/measure-alias-form';
import { useMeasureAlias } from '@hooks/measure-aliases/use-measure-alias';

export const EditMeasureAliasDialog: React.FC<DialogProps<'edit-measure-alias'>> = ({ data }) => {
    const isUpdate = !!data?.aliasId;

    const { data: alias, isLoading, isError } = useMeasureAlias(data?.aliasId);

    return (
        <BaseDialog
            dialogId='edit-measure-alias'
            title={
                isUpdate ? (
                    <>
                        <h2>Псевдоним параметра</h2>
                        {!!alias && <EntityLabel entity={alias} field='id' />}
                    </>
                ) : (
                    'Добавление псевдонима'
                )
            }
            hardClose>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить псевдоним</p>}
            {(!isUpdate || alias) && <MeasureAliasForm measure={data.measure} alias={alias} />}
        </BaseDialog>
    );
};
