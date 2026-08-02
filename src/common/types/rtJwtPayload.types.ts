import { JwtPayload } from './jwtPayload.types';

export class RtJwtPayload {
  refreshToken: string;
  payload: JwtPayload;
}
