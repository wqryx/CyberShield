// Script para generar PDF desde archivo Markdown
const markdownpdf = require('markdown-pdf');
const fs = require('fs');
const path = require('path');

const inputFile = './documentacion_parcial.md';
const outputFile = './CyberShield_Documentacion_Parcial.pdf';

// Opciones de estilo para el PDF
const options = {
  cssPath: path.join(__dirname, 'pdf-style.css'),
  remarkable: {
    html: true,
    breaks: true,
    plugins: [],
    syntax: ['footnote', 'sup', 'sub']
  }
};

// Crear archivo CSS para estilizar el PDF
const css = `
body {
  font-family: 'Arial', sans-serif;
  font-size: 12pt;
  line-height: 1.6;
  color: #333;
  margin: 2cm;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: #0f172a;
  margin-top: 1.5em;
}

h1 {
  font-size: 24pt;
  text-align: center;
  margin-bottom: 1.5cm;
  border-bottom: 2px solid #0f172a;
  padding-bottom: 0.5cm;
}

h2 {
  font-size: 18pt;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.2cm;
}

h3 {
  font-size: 14pt;
}

h4 {
  font-size: 12pt;
}

code {
  font-family: 'Courier New', monospace;
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

pre {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}

blockquote {
  border-left: 4px solid #ddd;
  padding: 0 1em;
  color: #666;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.5em;
}

th {
  background-color: #f2f2f2;
}

ul, ol {
  padding-left: 2em;
}

a {
  color: #0366d6;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
}
`;

fs.writeFileSync('pdf-style.css', css);

console.log('Generando PDF...');

// Convertir Markdown a PDF
markdownpdf(options)
  .from(inputFile)
  .to(outputFile, function () {
    console.log(`PDF generado exitosamente: ${outputFile}`);
  });