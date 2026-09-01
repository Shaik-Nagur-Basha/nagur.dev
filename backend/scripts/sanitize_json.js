import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../../frontend/public/data/projects.json');

if (!fs.existsSync(filePath)) {
  console.error(`File not found at ${filePath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(filePath, 'utf8');
const parsedData = JSON.parse(rawData);

const sanitizeId = (id) => {
  if (typeof id === 'string' && id.length === 26) {
    console.log(`Sanitizing ID: ${id} -> ${id.substring(2)}`);
    return id.substring(2);
  }
  return id;
};

const sanitize = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      if (key === '_id' || key === 'createdBy') {
        newObj[key] = sanitizeId(obj[key]);
      } else {
        newObj[key] = sanitize(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

const sanitizedData = sanitize(parsedData);

fs.writeFileSync(filePath, JSON.stringify(sanitizedData, null, 2), 'utf8');
console.log('projects.json has been sanitized successfully!');
