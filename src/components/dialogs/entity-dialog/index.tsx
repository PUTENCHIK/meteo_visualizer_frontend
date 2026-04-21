import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { entityComponents } from './items';
import { entityQueryHooks, type EntityType } from './queries';
import { Loader } from '@components/loader';

const entityTitles: Record<EntityType, string> = {
    'mast-config': 'Конфиг мачты',
    complex: 'Комплекс МАМКА',
};

export const EntityDialog: React.FC<DialogProps<'entity'>> = ({ data }) => {
    const { entityId, type } = data;
    const useQueryHook = entityQueryHooks[type];
    const Component = entityComponents[type];

    const { data: entity, isLoading, isError } = useQueryHook(entityId);

    return (
        <BaseDialog dialogId='entity' title={entityTitles[type]}>
            {isLoading && <Loader />}
            {isError && <span>Ошибка при загрузке</span>}
            {entity ? <Component data={entity} /> : <span>Не удалось получить сущность</span>}
        </BaseDialog>
    );
};
