import * as fs from 'fs';
import * as crypto from 'crypto';


const ENCRYPTION_KEY = '123455431qwertgfdswertyuiopkmn12'; 
const IV = '1234567890123456'; 

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

const secretsPath = './secrets122.json'; 
const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));

const encryptedSecrets = {
  username: encrypt(secrets.username),
  password: encrypt(secrets.password),
  database: encrypt(secrets.database),
};


fs.writeFileSync('./encrypted-secrets.json', JSON.stringify(encryptedSecrets, null, 2));