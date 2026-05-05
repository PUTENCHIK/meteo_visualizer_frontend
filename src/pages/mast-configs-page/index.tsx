import { Button } from '@components/button';
import { ComponentRowBox } from '@components/component-row-box';
import { InputLabel } from '@components/input-label';
import { Loader } from '@components/loader';
import { MastConfigItem } from '@entity-items/mast-config-item';
import { Toggle } from '@components/toggle';
import { useDialogs } from '@context/dialog-context';
import { useMastConfigs } from '@hooks/mast-configs/use-mast-configs';
import { HolyGrailLayout } from '@pages/holy-grail-layout';
import { useState } from 'react';
import { HasPermission } from '@pages/has-permission';
import { usePermission } from '@hooks/use-permission';

export const MastConfigsPage = () => {
    const { hasPermission } = usePermission();
    const { openDialog } = useDialogs();
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const {
        data: configs,
        isLoading,
        isError,
    } = useMastConfigs(includeDeleted && hasPermission('mast_config:restore'));

    return (
        <HolyGrailLayout>
            <ComponentRowBox
                left={[<h1>Конфиги мачт</h1>]}
                right={[
                    <HasPermission permission='mast_config:restore'>
                        <InputLabel label='удалённые' orientation='horizontal'>
                            <Toggle value={includeDeleted} onChange={setIncludeDeleted} />
                        </InputLabel>
                    </HasPermission>,
                    <HasPermission permission='mast_config:create'>
                        <Button
                            title='Добавить конфиг'
                            type='primary'
                            disabled={isLoading}
                            onClick={() => openDialog('edit-mast-config')}
                        />
                    </HasPermission>,
                ]}
                size='big'
            />

            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить конфиги</p>}
            {configs && (
                <>
                    {configs.length === 0 && <p>Нет конфигов в базе</p>}
                    {configs &&
                        configs.map((config, index) => (
                            <MastConfigItem key={index} data={config} />
                        ))}
                </>
            )}
        </HolyGrailLayout>
    );
};
