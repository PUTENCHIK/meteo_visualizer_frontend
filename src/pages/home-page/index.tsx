import { useUserComplexes } from '@hooks/api-data/use-user-complexes';
import { Loader } from '@components/loader';
import { ComplexItem } from '@components/complex-item';
import { HolyGrailLayout } from '@pages/holy-grail-layout';

export const HomePage = () => {
    const { data: userComplexes, isLoading, isError } = useUserComplexes();

    return (
        <HolyGrailLayout>
            <h1>Доступные комплексы</h1>
            {isLoading && <Loader />}
            {isError && <p>Не удалось загрузить комплексы</p>}
            {userComplexes && (
                <>
                    {userComplexes.length === 0 && <p>У вас нет ни одного комплекса</p>}
                    {userComplexes &&
                        userComplexes.map((userComplex, index) => (
                            <ComplexItem key={index} data={userComplex.complex} />
                        ))}
                </>
            )}
        </HolyGrailLayout>
    );
};
