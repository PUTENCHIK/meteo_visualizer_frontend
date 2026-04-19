import { Button } from '@components/button';
import { ComplexItem } from '@components/complex-item';
import { ComponentRowBox } from '@components/component-row-box';
import { Loader } from '@components/loader';
import { useDialogs } from '@context/dialog-context';
import { useComplexes } from '@hooks/api-data/use-complexes';
import { HolyGrailLayout } from '@pages/holy-grail-layout';

export const ComplexesPage = () => {
    const { openDialog } = useDialogs();
    const { data: complexes, isLoading, isError } = useComplexes();

    return (
        <HolyGrailLayout>
            <ComponentRowBox
                left={[<h1>Комплексы МАМКА</h1>]}
                right={[
                    <Button
                        title='Добавить комплекс'
                        type='primary'
                        disabled={isLoading}
                        onClick={() => openDialog('edit-complex')}
                    />,
                ]}
            />

            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить комплексы</p>}
            {complexes && (
                <>
                    {complexes.length === 0 && <p>Нет комплексов в базе</p>}
                    {complexes &&
                        complexes.map((complex, index) => (
                            <ComplexItem key={index} data={complex} />
                        ))}
                </>
            )}
        </HolyGrailLayout>
    );
};
