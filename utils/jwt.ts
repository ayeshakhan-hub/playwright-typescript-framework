export interface DecodedJwt {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  sub: string;
  role: string;
  [key: string]: unknown;
}

export function decodeJwt(token: string): DecodedJwt {
  const payloadBase64 = token.split('.')[1];
  const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
  return JSON.parse(payloadJson);
}

export function createExpiredToken(validToken: string): string {
  const decoded = decodeJwt(validToken);
  const expiredPayload = { ...decoded, exp: decoded.iat - 10 };

  const [header, , signature] = validToken.split('.');
  const expiredPayloadBase64 = Buffer.from(JSON.stringify(expiredPayload)).toString('base64');

  return `${header}.${expiredPayloadBase64}.${signature}`;
}