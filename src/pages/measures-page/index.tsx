import { Button } from '@components/button';
import { ComponentRowBox } from '@components/component-row-box';
import { InputLabel } from '@components/input-label';
import { Loader } from '@components/loader';
import { Toggle } from '@components/toggle';
import { useDialogs } from '@context/dialog-context';
import { MeasureItem } from '@entity-items/measure-item';
import { useMeasures } from '@hooks/measures/use-measures';
import { usePermission } from '@hooks/use-permission';
import { HasPermission } from '@pages/has-permission';
import { HolyGrailLayout } from '@pages/holy-grail-layout';
import { useState } from 'react';

export const MeasuresPage = () => {
    const { hasPermission } = usePermission();
    const { openDialog } = useDialogs();
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const {
        data: measures,
        isLoading,
        isError,
    } = useMeasures(includeDeleted && hasPermission('measure:restore'));

    return (
        <HolyGrailLayout>
            <ComponentRowBox
                left={[<h1>Пользовательские параметры</h1>]}
                right={[
                    <HasPermission permission='measure:restore'>
                        <InputLabel label='удалённые' orientation='horizontal'>
                            <Toggle value={includeDeleted} onChange={setIncludeDeleted} />
                        </InputLabel>
                    </HasPermission>,
                    <HasPermission permission='measure:create'>
                        <Button
                            title='Добавить параметр'
                            type='primary'
                            disabled={isLoading}
                            onClick={() => openDialog('edit-measure')}
                        />
                    </HasPermission>,
                ]}
            />

            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить параметры</p>}
            {measures && !isError && !isLoading && (
                <>
                    {measures.length > 0 ? (
                        measures.map((measure, index) => <MeasureItem key={index} data={measure} />)
                    ) : (
                        <p>Нет параметров в базе</p>
                    )}
                </>
            )}
        </HolyGrailLayout>
    );
};
