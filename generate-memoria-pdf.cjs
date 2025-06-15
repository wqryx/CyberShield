// Script para generar PDF de la memoria completa
const markdownpdf = require('markdown-pdf');
const fs = require('fs');
const path = require('path');

const inputFile = './memoria_cybershield.md';
const outputFile = './CyberShield_Memoria_Completa.pdf';

// Opciones de estilo para el PDF académico
const options = {
  cssPath: path.join(__dirname, 'memoria-style.css'),
  remarkable: {
    html: true,
    breaks: true,
    plugins: [],
    syntax: ['footnote', 'sup', 'sub']
  },
  paperFormat: 'A4',
  paperOrientation: 'portrait',
  paperBorder: '2cm'
};

// CSS específico para formato académico
const css = `
@page {
  margin: 2cm;
  size: A4;
  @bottom-center {
    content: counter(page);
    font-family: Arial, sans-serif;
    font-size: 10pt;
  }
}

body {
  font-family: 'Arial', sans-serif;
  font-size: 12pt;
  line-height: 1.5;
  color: #000;
  margin: 0;
  padding: 0;
  text-align: justify;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: #000;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  page-break-after: avoid;
}

h1 {
  font-size: 18pt;
  text-align: center;
  margin-bottom: 1.5cm;
  border-bottom: 2px solid #000;
  padding-bottom: 0.5cm;
  page-break-before: always;
}

h2 {
  font-size: 16pt;
  border-bottom: 1px solid #333;
  padding-bottom: 0.2cm;
  margin-top: 2em;
}

h3 {
  font-size: 14pt;
  margin-top: 1.5em;
}

h4 {
  font-size: 12pt;
  margin-top: 1.2em;
}

p {
  margin: 0;
  margin-bottom: 0.5em;
  text-indent: 0;
  orphans: 2;
  widows: 2;
}

ul, ol {
  margin: 0.5em 0;
  padding-left: 2em;
}

li {
  margin-bottom: 0.25em;
}

blockquote {
  border-left: 4px solid #333;
  padding: 0 1em;
  margin: 1em 0;
  color: #555;
  font-style: italic;
}

code {
  font-family: 'Courier New', monospace;
  background-color: #f5f5f5;
  padding: 0.1em 0.3em;
  border-radius: 2px;
  font-size: 11pt;
}

pre {
  background-color: #f5f5f5;
  padding: 0.5em;
  border-radius: 3px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 10pt;
  line-height: 1.2;
  margin: 1em 0;
  page-break-inside: avoid;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  page-break-inside: avoid;
}

th, td {
  border: 1px solid #333;
  padding: 0.3em 0.5em;
  text-align: left;
  font-size: 11pt;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}

a {
  color: #0066cc;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
  page-break-inside: avoid;
}

.page-break {
  page-break-before: always;
}

/* Estilos específicos para portada */
.portada {
  text-align: center;
  page-break-after: always;
}

.titulo-principal {
  font-size: 24pt;
  font-weight: bold;
  margin: 3cm 0 1cm 0;
}

.subtitulo {
  font-size: 18pt;
  font-weight: bold;
  margin: 0 0 4cm 0;
}

.datos-autor {
  font-size: 14pt;
  margin: 0.5cm 0;
}

/* Estilos para índice */
.indice {
  page-break-after: always;
}

.indice ul {
  list-style: none;
  padding: 0;
}

.indice li {
  margin: 0.3em 0;
  display: flex;
  justify-content: space-between;
}

/* Numeración de páginas */
.numeracion {
  position: fixed;
  bottom: 1cm;
  right: 50%;
  font-size: 10pt;
}

/* Bibliografía */
.bibliografia p {
  text-indent: -1em;
  padding-left: 1em;
  margin-bottom: 0.5em;
}
`;

fs.writeFileSync('memoria-style.css', css);

console.log('Generando PDF de la memoria académica...');

// Convertir Markdown a PDF
markdownpdf(options)
  .from(inputFile)
  .to(outputFile, function () {
    console.log(`PDF de memoria generado exitosamente: ${outputFile}`);
    console.log('Características del documento:');
    console.log('- Formato: A4');
    console.log('- Márgenes: 2cm');
    console.log('- Fuente: Arial 12pt');
    console.log('- Interlineado: 1.5');
    console.log('- Páginas numeradas');
    console.log('- Formato académico completo');
  });