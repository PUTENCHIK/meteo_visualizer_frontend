import { Button } from '@components/button';
import { ComplexItem } from '@components/complex-item';
import { ComponentHeader } from '@components/component-header';
import { Loader } from '@components/loader';
import { useComplexes } from '@hooks/api-data/use-complexes';
import { HolyGrailLayout } from '@pages/holy-grail-layout';

export const ComplexesPage = () => {
    const { data: complexes, isLoading, isError } = useComplexes();

    return (
        <HolyGrailLayout>
            <ComponentHeader
                left={[<h1>Комплексы МАМКА</h1>]}
                right={[<Button title='Добавить' type='primary' />]}
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
