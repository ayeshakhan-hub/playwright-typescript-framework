import fs from 'fs';
import path from 'path';

const CREDENTIALS_PATH = path.resolve(__dirname, '../playwright/.auth/customer-credentials.json');

export interface StoredCredentials {
  email: string;
  password: string;
}

export function saveCredentials(creds: StoredCredentials) {
  fs.mkdirSync(path.dirname(CREDENTIALS_PATH), { recursive: true });
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(creds, null, 2));
}

export function loadCredentials(): StoredCredentials {
  const raw = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
  return JSON.parse(raw);
}