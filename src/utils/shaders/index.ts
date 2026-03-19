export const fragmentShader = `
    varying float vValue;
    uniform float uMinVal;
    uniform float uMaxVal;
    uniform float uOpacity;

    void main() {
        float t = clamp((vValue - uMinVal) / (uMaxVal - uMinVal), 0.0, 1.0);
        vec3 color = vec3(t, 0.0, 1.0 - t);
        gl_FragColor = vec4(color, uOpacity);
    }
`;

export const vertexShader = (maxStations: number) => `
    #define MAX_STATIONS ${maxStations}

    // значение в точке pos, отдаваемая в fragmentShader
    varying float vValue;
    // внешние переменные
    uniform vec4 uStations[MAX_STATIONS];
    uniform int uStationCount;
    uniform float uDegree;
    uniform float uMinVal;
    uniform float uMaxVal;
    uniform bool uScaling;
    uniform float uScalingHeight;

    void main() {
        // позиция частицы
        vec3 pos = instanceMatrix[3].xyz;
        
        // интерполяция
        float weightSum = 0.0;
        float valueSum = 0.0;
        
        for(int i = 0; i < MAX_STATIONS; i++) {
            // не учитывать станции-пустышки
            if (i >= uStationCount) break;

            float d = distance(pos, uStations[i].xyz);
            // ограничение мин расстояния - max(d, 0.1)
            float w = 1.0 / pow(d, uDegree);
            valueSum += uStations[i].w * w;
            weightSum += w;
        }
        
        vValue = valueSum / weightSum;
        vec3 localPos = position;

        if (uScaling) {
            float t = clamp((vValue - uMinVal) / (uMaxVal - uMinVal), 0.0, 1.0);

            // коэффициент для масштабирования * нормированное значение * максимальная высота
            // визуализации
            float yScale = 2.0 * t * uScalingHeight; 

            // вершины верхней грани boxGeometry заскейлятся
            if (localPos.y > 0.0) {
                localPos.y *= yScale;
            }
        }

        // C сам разберётся
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(localPos, 1.0);
    }
`;
