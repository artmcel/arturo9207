import { JWTPayload } from '@sisu/shared';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}