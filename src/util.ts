import { ReadonlyMat4 } from 'gl-matrix';

export function mat4ToTransformMatrix(m: ReadonlyMat4): string {
  return `matrix3d(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]},${m[6]},${m[7]},${m[8]},${m[9]},${m[10]},${m[11]},${m[12]},${m[13]},${m[14]},${m[15]})`;
}
