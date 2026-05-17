import { useSceneSettings } from '@hooks/use-scene-settings';
import { BoxMesh } from '@models_/box-mesh';
import { Vector3 } from 'three';

interface BasePlateModelProps {
    size: Vector3;
}

export const BasePlateModel = ({ size }: BasePlateModelProps) => {
    const { map: settings } = useSceneSettings();

    return (
        <BoxMesh
            size={size}
            position={new Vector3(0, -size.y / 2, 0)}
            color={settings.model.basePlate.color}
        />
    );
};
