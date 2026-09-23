export function createMockIdToken(claims: Record<string, unknown>): string {
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: 'https://mock-oauth-provider.test',
    aud: 'test-client-id',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...claims,
  };

  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `${encode(header)}.${encode(payload)}.mock-signature`;
}