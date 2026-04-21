import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { MastForm } from '@forms/mast-form';
import { useMast } from '@hooks/masts/use-mast';
import { useMastConfigs } from '@hooks/mast-configs/use-mast-configs';

export const EditMastDialog: React.FC<DialogProps<'edit-mast'>> = ({ data }) => {
    const isUpdate = !!data?.mastId;

    const { data: mast, isLoading: isMastLoading, isError: isMastError } = useMast(data?.mastId);

    const {
        data: mastConfigs,
        isLoading: isConfigsLoading,
        isError: isConfigsError,
    } = useMastConfigs();

    const isLoading = isMastLoading || isConfigsLoading;
    const isError = isMastError || isConfigsError;

    return (
        <BaseDialog
            dialogId='edit-mast'
            title={
                isUpdate ? (
                    <>
                        <h2>Мачта</h2>
                        {!!mast && <EntityLabel entity={mast} />}
                    </>
                ) : (
                    'Добавление мачты'
                )
            }
            hardClose>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить мачту или конфиги мачт</p>}
            {(!isUpdate || mast) && mastConfigs && (
                <MastForm complex={data.complex} mast={mast} mastConfigs={mastConfigs} />
            )}
        </BaseDialog>
    );
};
