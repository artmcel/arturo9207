import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

function fixImports(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      fixImports(fullPath);
    } else if (entry.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');

      content = content.replace(
        /from\s+['"](\.[^'"]*)['"];?/g,
        (match, importPath) => {
          if (importPath.startsWith('.')) {
            const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
            let newPath = importPath;

            if (importPath.endsWith('.js')) {
              return match;
            }

            const dirPath = resolvedPath;
            const filePath = resolvedPath + '.js';
            const indexPath = path.join(resolvedPath, 'index.js');

            if (fs.existsSync(filePath)) {
              newPath = importPath + '.js';
            } else if (fs.existsSync(indexPath)) {
              newPath = importPath + '/index.js';
            } else if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
              newPath = importPath + '/index.js';
            } else {
              newPath = importPath + '.js';
            }

            return `from '${newPath}'`;
          }
          return match;
        }
      );

      fs.writeFileSync(fullPath, content);
    }
  }
}

fixImports(distDir);
console.log('Imports fixed');