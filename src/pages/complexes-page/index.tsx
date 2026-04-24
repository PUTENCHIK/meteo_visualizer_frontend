import clsx from 'clsx';
import s from './complexes-page.module.scss';
import { Button } from '@components/button';
import { ComplexItem } from '@entity-items/complex-item';
import { ComponentRowBox } from '@components/component-row-box';
import { InputLabel } from '@components/input-label';
import { Loader } from '@components/loader';
import { Toggle } from '@components/toggle';
import { useDialogs } from '@context/dialog-context';
import { useComplexes } from '@hooks/complexes/use-complexes';
import { HolyGrailLayout } from '@pages/holy-grail-layout';
import { useState } from 'react';
import { HasPermission } from '@pages/has-permission';

export const ComplexesPage = () => {
    const { openDialog } = useDialogs();
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const { data: complexes, isLoading, isError } = useComplexes(includeDeleted);

    return (
        <HolyGrailLayout>
            <ComponentRowBox
                left={[<h1>Комплексы МАМКА</h1>]}
                right={[
                    <InputLabel label='удалённые' orientation='horizontal'>
                        <Toggle value={includeDeleted} onChange={setIncludeDeleted} />
                    </InputLabel>,
                    <HasPermission permission='complex:create'>
                        <Button
                            title='Добавить комплекс'
                            type='primary'
                            disabled={isLoading}
                            onClick={() => openDialog('edit-complex')}
                        />
                    </HasPermission>
                ]}
                size='big'
            />

            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить комплексы</p>}
            {complexes && (
                <div className={clsx(s['complexes-list'])}>
                    {complexes.length === 0 && <p>Нет комплексов в базе</p>}
                    {complexes &&
                        complexes.map((complex, index) => (
                            <div className={clsx(s['complex-container'])}>
                                <ComplexItem key={index} data={complex} />
                                {!complex.deleted_at && (
                                    <ComponentRowBox
                                        right={[
                                            <Button
                                                title='Перейти на страницу'
                                                type='tertiary'
                                                href={`/complexes/${complex.id}`}
                                            />,
                                        ]}
                                    />
                                )}
                            </div>
                        ))}
                </div>
            )}
        </HolyGrailLayout>
    );
};
