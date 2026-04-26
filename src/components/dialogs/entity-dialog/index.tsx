import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';
import { entityComponents } from './items';
import { entityQueryHooks, type EntityType } from './queries';
import { Loader } from '@components/loader';

const entityTitles: Record<EntityType, string> = {
    'mast-config': 'Конфиг мачты',
    complex: 'Комплекс МАМКА',
    role: 'Роль пользователей',
    user: 'Пользователь'
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
            {entity && !isError ? (
                <Component data={entity} />
            ) : (
                <span>Не удалось загрузить сущность</span>
            )}
        </BaseDialog>
    );
};
