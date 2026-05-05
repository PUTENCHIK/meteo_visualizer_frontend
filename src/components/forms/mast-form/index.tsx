import { Button } from '@components/button';
import { BaseForm } from '@forms/base-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ComplexWithCreatorSchema, MastConfigSchema, MastSchema } from '@utils/schemas';
import { Controller, useForm } from 'react-hook-form';
import { mastSchema, type MastFormData } from './schema';
import { useDialogs } from '@context/dialog-context';
import { InputLabel } from '@components/input-label';
import { NumberInput } from '@components/number-input';
import { useCreateMast } from '@hooks/masts/use-create-mast';
import { useUpdateMast } from '@hooks/masts/use-update-mast';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { Select } from '@components/select';
import { GeographicInput } from '@components/geographic-input';
import { TextInput } from '@components/text-input';

interface MastFormProps {
    complex: ComplexWithCreatorSchema;
    mast?: MastSchema;
    mastConfigs: MastConfigSchema[];
}

export const MastForm = ({ complex, mast, mastConfigs }: MastFormProps) => {
    const { closeDialog } = useDialogs();
    const createMutation = useCreateMast();
    const updateMutation = useUpdateMast();

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<MastFormData>({
        resolver: zodResolver(mastSchema),
        mode: 'all',
        defaultValues: {
            complex_id: complex.id.toString(),
            config_id: mast?.config?.id.toString() ?? '-',
            prefix: mast?.prefix ?? '',
            latitude: mast ? Number(mast.latitude) : 0,
            longitude: mast ? Number(mast.longitude) : 0,
            rotation: mast?.rotation ?? 0,
        },
    });

    const handleFormSubmit = async (data: MastFormData) => {
        if (mast) {
            await updateMutation.mutateAsync({ id: mast.id, data });
        } else {
            await createMutation.mutateAsync({ data });
        }
        closeDialog();
    };

    return (
        <BaseForm
            buttons={[
                <Button title='Сбросить' onClick={() => reset()} />,
                <Button
                    title={mast ? 'Сохранить' : 'Добавить'}
                    type='primary'
                    actionType='submit'
                    disabled={!isValid || isLoading || !isDirty}
                />,
            ]}
            onSubmit={handleSubmit(handleFormSubmit)}>
            <ComponentRowBox
                left={[<span>Комплекс:</span>, <EntityLabel entity={complex} />]}
                size='tiny'
            />
            <Controller
                name='config_id'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Конфиг' required error={errors.config_id?.message}>
                        <Select
                            {...field}
                            options={{
                                '-': 'Выберите конфиг',
                                ...Object.fromEntries(
                                    mastConfigs.map((c) => [c.id.toString(), c.name]),
                                ),
                            }}
                        />
                    </InputLabel>
                )}
            />
            <Controller
                name='prefix'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Префикс' required error={errors.prefix?.message}>
                        <TextInput {...field} placeholder='north' />
                    </InputLabel>
                )}
            />
            <Controller
                name='latitude'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Широта' required error={errors.latitude?.message} notLabel>
                        <GeographicInput {...field} param='lat' />
                    </InputLabel>
                )}
            />
            <Controller
                name='longitude'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Долгота' required error={errors.longitude?.message} notLabel>
                        <GeographicInput {...field} param='lon' />
                    </InputLabel>
                )}
            />
            <Controller
                name='rotation'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Угол поворота' required error={errors.rotation?.message}>
                        <NumberInput {...field} postfix='°' />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
