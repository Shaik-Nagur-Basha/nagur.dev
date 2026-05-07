const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\sknba\\nagur.dev\\frontend\\src\\components\\admin\\AdminLayout.jsx';
const content = fs.readFileSync(filePath, 'utf8');

try {
  // Simple check for balanced braces
  let braces = 0;
  let brackets = 0;
  let parens = 0;
  
  for (let char of content) {
    if (char === '{') braces++;
    if (char === '}') braces--;
    if (char === '[') brackets++;
    if (char === ']') brackets--;
    if (char === '(') parens++;
    if (char === ')') parens--;
  }
  
  console.log(`Braces: ${braces}`);
  console.log(`Brackets: ${brackets}`);
  console.log(`Parens: ${parens}`);
  
  if (braces !== 0 || brackets !== 0 || parens !== 0) {
    console.error('Syntax error: unbalanced characters detected.');
  } else {
    console.log('Characters are balanced.');
  }
} catch (e) {
  console.error(e);
}
