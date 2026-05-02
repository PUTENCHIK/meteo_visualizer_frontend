export const fragmentShader = (maxColors: number) => `
    #define MAX_COLORS ${maxColors}

    varying float vValue;
    uniform vec4 uColors[MAX_COLORS];
    uniform int uColorCount;
    uniform float uMinVal;
    uniform float uMaxVal;
    uniform float uOpacity;

    void main() {
        // нормализация значения
        float t = clamp((vValue - uMinVal) / (uMaxVal - uMinVal), 0.0, 1.0);
        // значение цвета по умолчанию
        vec3 color = uColors[0].xyz;

        for (int i = 0; i < MAX_COLORS - 1; i++) {
            // пропускаем цвета, которых нет
            if (i >= uColorCount - 1) break;

            vec4 start = uColors[i];
            vec4 end = uColors[i+1];

            // если цвет в промежутке двух цветов
            if (t >= start.w && t <= end.w) {
                float localT = (t - start.w) / (end.w - start.w);
                color = mix(start.xyz, end.xyz, localT);
                break;
            }

            // t больше цветов в промежутке
            if (t > end.w) {
                color = end.xyz;
            }
        }
        // color = vec3(t, 0.0, 1.0 - t);
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
