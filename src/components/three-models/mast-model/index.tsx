import { Vector3 } from 'three';
import { BoxMesh } from '@models_/box-mesh';
import { MeshGroup } from '@models_/mesh-group';
import { YardModel } from '@models_/yard-model';
import { CylinderMesh } from '@models_/cylinder-mesh';
import { useSceneSettings } from '@hooks/use-scene-settings';
import type { MastSchema } from '@utils/schemas';
import { geographicToPolar } from '@utils/coordinate-systems';
import { useComplexStore } from '@stores/complex-store';
import { useMemo } from 'react';

interface MastModelProps {
    data: MastSchema;
}

export const MastModel = ({ data }: MastModelProps) => {
    const { map: settings } = useSceneSettings();
    const { complex } = useComplexStore();

    const defaultMastHeight = 5;

    const position = useMemo(() => {
        return complex && geographicToPolar(data.latitude, data.longitude, complex.latitude);
    }, [data, complex]);

    if (!complex || !position) return null;

    return (
        <MeshGroup
            name={data.id.toString()}
            position={new Vector3(position.x, 0, position.y)}
            rotation={new Vector3(0, data.rotation, 0)}>
            {/* Платформа для мачты */}
            {settings.model.masts.plates.enable && (
                <BoxMesh
                    size={
                        new Vector3(
                            settings.model.masts.plates.size,
                            settings.model.masts.plates.height,
                            settings.model.masts.plates.size,
                        )
                    }
                    position={new Vector3(0, settings.model.masts.plates.height / 2, 0)}
                    color={settings.model.masts.plates.color}
                />
            )}

            {/* Мачта */}
            <CylinderMesh
                radius={settings.model.masts.radius}
                height={data.config?.height ?? defaultMastHeight}
                position={new Vector3(0, (data.config?.height ?? defaultMastHeight) / 2, 0)}
                color={settings.model.masts.mastsColor}
            />

            {data.config && (
                <>
                    {/* Реи с метеостанциями */}
                    {data.config.yards.map((yard, index) => (
                        <YardModel key={index} data={yard} mastId={data.id} />
                    ))}
                </>
            )}
        </MeshGroup>
    );
};
