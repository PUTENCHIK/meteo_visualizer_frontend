import { Button } from '@components/button';
import { ComponentRowBox } from '@components/component-row-box';
import { InputLabel } from '@components/input-label';
import { Loader } from '@components/loader';
import { MastConfigItem } from '@components/mast-config-item';
import { Toggle } from '@components/toggle';
import { useDialogs } from '@context/dialog-context';
import { useMastConfigs } from '@hooks/api-data/use-mast-configs';
import { HolyGrailLayout } from '@pages/holy-grail-layout';
import { useState } from 'react';

export const MastConfigsPage = () => {
    const { openDialog } = useDialogs();
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const { data: configs, isLoading, isError } = useMastConfigs(includeDeleted);

    return (
        <HolyGrailLayout>
            <ComponentRowBox
                left={[<h1>Конфиги мачт</h1>]}
                right={[
                    <InputLabel label='удалённые' orientation='horizontal'>
                        <Toggle value={includeDeleted} onChange={setIncludeDeleted} />
                    </InputLabel>,
                    <Button
                        title='Добавить конфиг'
                        type='primary'
                        disabled={isLoading}
                        onClick={() => openDialog('edit-mast-config')}
                    />,
                ]}
                size='big'
            />

            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить комплексы</p>}
            {configs && (
                <>
                    {configs.length === 0 && <p>Нет комплексов в базе</p>}
                    {configs &&
                        configs.map((config, index) => (
                            <MastConfigItem key={index} data={config} />
                        ))}
                </>
            )}
        </HolyGrailLayout>
    );
};
