import building from '@assets/building.svg?react';
import compass from '@assets/compass.svg?react';
import telescope from '@assets/telescope.svg?react';
import wind from '@assets/wind.svg?react';
import camera from '@assets/camera.svg?react';
import scene from '@assets/scene.svg?react';
import arrow from '@assets/arrow.svg?react';
import cross from '@assets/cross.svg?react';
import bin from '@assets/bin.svg?react';
import eye from '@assets/eye.svg?react';
import eyeOff from '@assets/eye-off.svg?react';
import settings from '@assets/settings.svg?react';
import user from '@assets/user.svg?react';
import logout from '@assets/logout.svg?react';
import pencil from '@assets/pencil.svg?react';
import star from '@assets/star.svg?react';
import starOff from '@assets/star-off.svg?react';
import plus from '@assets/plus.svg?react';
import type { IconName, IconSize } from './types';

export const iconFiles: Record<IconName, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    building: building,
    compass: compass,
    telescope: telescope,
    wind: wind,
    camera: camera,
    scene: scene,
    arrow: arrow,
    cross: cross,
    bin: bin,
    eye: eye,
    'eye-off': eyeOff,
    user: user,
    settings: settings,
    logout: logout,
    pencil: pencil,
    star: star,
    'star-off': starOff,
    plus: plus,
};

export const sizesToStrokes: Record<IconSize, number> = {
    48: 2,
    36: 2,
    28: 2,
    24: 2,
    20: 2,
    16: 3,
    12: 3,
};
