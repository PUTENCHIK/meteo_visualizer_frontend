import { Vector3 } from 'three';
import { BoxMesh } from '@models_/box-mesh';
import { MeshGroup } from '@models_/mesh-group';
import { YardModel } from '@models_/yard-model';
import { CylinderMesh } from '@models_/cylinder-mesh';
import { useSettings } from '@context/use-settings';
import { getMastConfig, type Mast } from '@utils/complexes';
import { polarToLocal } from '@utils/coordinate-systems';

interface MastModelProps {
    data: Mast;
}

export const MastModel = ({ data }: MastModelProps) => {
    const { map: settings } = useSettings();

    const config = getMastConfig(data.configName);

    return (
        <MeshGroup
            name={data.id}
            position={new Vector3(polarToLocal(data.position).x, 0, polarToLocal(data.position).y)}
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
                height={config.height}
                position={new Vector3(0, config.height / 2, 0)}
                color={settings.model.masts.mastsColor}
            />

            {/* Реи с метеостанциями */}
            {config.yards.map((yard, index) => (
                <YardModel key={index} data={yard} mastId={data.id} />
            ))}
        </MeshGroup>
    );
};
