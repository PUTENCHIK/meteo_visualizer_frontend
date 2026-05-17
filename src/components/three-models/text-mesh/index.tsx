import { useSceneSettings } from '@hooks/use-scene-settings';
import { MeshGroup } from '@models_/mesh-group';
import { Center, Edges, Text3D } from '@react-three/drei';
import type { EdgesEnable } from '@utils/three-models';
import { Vector3 } from 'three';

type TextFont = 'roboto';

const fontsToFiles: Record<TextFont, string> = {
    roboto: '/roboto_regular.json',
};

interface TextMeshProps extends EdgesEnable {
    text: string;
    color?: string;
    position?: Vector3;
    rotation?: Vector3;
    font?: TextFont;
    size?: number;
    height?: number;
}

export const TextMesh = ({
    text,
    color,
    position = new Vector3(),
    rotation = new Vector3(),
    font = 'roboto',
    size,
    height,
    forceEdges,
}: TextMeshProps) => {
    const { map: settings } = useSceneSettings();

    const isEdges =
        forceEdges === 'with' || (forceEdges !== 'without' && settings.scene.edges.enable);

    return (
        <MeshGroup position={position} rotation={rotation}>
            <Center>
                <Text3D font={fontsToFiles[font]} size={size} height={height}>
                    {text.trim()}
                    <meshStandardMaterial color={color} />
                    {isEdges && (
                        <Edges
                            color={settings.scene.edges.color}
                            threshold={15}
                            lineWidth={settings.scene.edges.thickness}
                        />
                    )}
                </Text3D>
            </Center>
        </MeshGroup>
    );
};
