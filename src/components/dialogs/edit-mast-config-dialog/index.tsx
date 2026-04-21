import { EntityLabel } from '@components/entity-label';
import { Loader } from '@components/loader';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { MastConfigForm } from '@forms/mast-config-form';
import { useMastConfig } from '@hooks/mast-configs/use-mast-config';

export const EditMastConfigDialog: React.FC<DialogProps<'edit-mast-config'>> = ({ data }) => {
    const isUpdate = !!data?.configId;

    const { data: config, isLoading, isError } = useMastConfig(data?.configId);

    return (
        <BaseDialog
            dialogId='edit-mast-config'
            title={
                isUpdate ? (
                    <>
                        <h2>Конфиг мачты</h2>
                        {!!config && <EntityLabel entity={config} field='id' />}
                    </>
                ) : (
                    'Добавление конфига мачты'
                )
            }
            hardClose>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить конфиг мачты</p>}
            {(!isUpdate || config) && <MastConfigForm config={config} />}
        </BaseDialog>
    );
};
