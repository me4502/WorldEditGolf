import { rem as polishedRem } from 'polished';

const REM_BASE_PX = '16px';

export function rem(pxVal: string | number): string {
    return polishedRem(pxVal, REM_BASE_PX);
}
