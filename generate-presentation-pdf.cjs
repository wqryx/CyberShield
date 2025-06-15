const PptxGenJS = require('pptxgenjs');

function createCyberShieldPresentationForPDF() {
  const pptx = new PptxGenJS();
  
  // Configuración global de colores
  const colors = {
    primary: '1E40AF',    // Azul oscuro
    secondary: '3B82F6',  // Azul medio
    accent: '60A5FA',     // Azul claro
    dark: '000000',       // Negro
    light: 'FFFFFF',      // Blanco
    gray: '6B7280'        // Gris para texto secundario
  };

  // Configuración de layout para PDF
  pptx.layout = 'LAYOUT_16x9';

  // DIAPOSITIVA 1: PORTADA
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.primary };
  
  slide1.addText('CYBERSHIELD', {
    x: 0.5, y: 2, w: 12, h: 1.5,
    fontSize: 48,
    fontFace: 'Arial',
    color: colors.light,
    bold: true,
    align: 'center'
  });
  
  slide1.addText('Plataforma de Ciberseguridad para Usuarios No Técnicos', {
    x: 0.5, y: 3.5, w: 12, h: 1,
    fontSize: 24,
    fontFace: 'Arial',
    color: colors.accent,
    align: 'center'
  });
  
  slide1.addText('Trabajo de Fin de Grado\nDesarrollo de Aplicaciones Multiplataforma', {
    x: 0.5, y: 5.5, w: 12, h: 1.5,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.light,
    align: 'center'
  });
  
  slide1.addText('Roberto Cristian Mangiurea Anton\n2º DAM - Curso 2024/2025\n30 de Mayo de 2025', {
    x: 0.5, y: 7.5, w: 12, h: 1.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.accent,
    align: 'center'
  });

  // DIAPOSITIVA 2: ÍNDICE
  const slide2 = pptx.addSlide();
  slide2.background = { color: colors.light };
  
  slide2.addText('ÍNDICE', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 36,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center'
  });
  
  const indexItems = [
    '1. Introducción',
    '2. Justificación del Proyecto',
    '3. Objetivos',
    '4. Trabajo Desarrollado',
    '5. Arquitectura del Sistema',
    '6. Módulos Implementados',
    '7. Conclusiones',
    '8. Fuentes y Referencias'
  ];
  
  indexItems.forEach((item, index) => {
    slide2.addText(item, {
      x: 2, y: 2 + (index * 0.6), w: 8, h: 0.5,
      fontSize: 20,
      fontFace: 'Arial',
      color: colors.dark
    });
  });

  // DIAPOSITIVA 3: INTRODUCCIÓN
  const slide3 = pptx.addSlide();
  slide3.background = { color: colors.light };
  
  slide3.addText('INTRODUCCIÓN', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 36,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center'
  });
  
  slide3.addText('Problemática Actual en Ciberseguridad', {
    x: 0.5, y: 1.8, w: 12, h: 0.6,
    fontSize: 24,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  const introText = `
• 78% de usuarios domésticos han sido víctimas de ataques cibernéticos

• Solo 23% utiliza herramientas de seguridad adecuadas

• Brecha significativa entre necesidad de protección y capacidad técnica

• Herramientas existentes diseñadas exclusivamente para profesionales

• Falta de educación práctica en detección de amenazas`;

  slide3.addText(introText, {
    x: 1, y: 2.8, w: 11, h: 3,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide3.addText('CyberShield democratiza la ciberseguridad, haciendo accesibles las herramientas de protección digital para todos los usuarios.', {
    x: 0.5, y: 6.5, w: 12, h: 1.2,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center',
    fill: { color: colors.accent, transparency: 20 }
  });

  // DIAPOSITIVA 4: JUSTIFICACIÓN
  const slide4 = pptx.addSlide();
  slide4.background = { color: colors.light };
  
  slide4.addText('JUSTIFICACIÓN DEL PROYECTO', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 32,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center'
  });
  
  slide4.addText('PROBLEMAS IDENTIFICADOS', {
    x: 0.5, y: 1.8, w: 5.5, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide4.addText(`• Complejidad técnica elevada
• Falta de educación en seguridad
• Fragmentación de soluciones
• Costos inaccesibles para usuarios domésticos`, {
    x: 0.8, y: 2.5, w: 5, h: 2.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide4.addText('SOLUCIÓN PROPUESTA', {
    x: 6.5, y: 1.8, w: 5.5, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide4.addText(`• Interfaz intuitiva y accesible
• Educación integrada y práctica
• Plataforma integral unificada
• Solución gratuita y completa`, {
    x: 6.8, y: 2.5, w: 5, h: 2.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide4.addText('IMPACTO ESPERADO', {
    x: 0.5, y: 5.5, w: 12, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide4.addText('Reducir la brecha digital en ciberseguridad y empoderar a usuarios no técnicos para proteger efectivamente su información personal', {
    x: 0.5, y: 6.3, w: 12, h: 1.2,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.dark,
    align: 'center'
  });

  // DIAPOSITIVA 5: OBJETIVOS
  const slide5 = pptx.addSlide();
  slide5.background = { color: colors.light };
  
  slide5.addText('OBJETIVOS', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 36,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center'
  });
  
  slide5.addText('OBJETIVO GENERAL', {
    x: 0.5, y: 1.5, w: 12, h: 0.6,
    fontSize: 20,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide5.addText('Desarrollar una plataforma integral de ciberseguridad que democratice el acceso a herramientas de protección digital para usuarios no técnicos', {
    x: 0.5, y: 2.2, w: 12, h: 1,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.dark,
    align: 'center',
    fill: { color: colors.accent, transparency: 20 }
  });
  
  slide5.addText('OBJETIVOS ESPECÍFICOS', {
    x: 0.5, y: 3.5, w: 12, h: 0.6,
    fontSize: 20,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide5.addText(`• Implementar gestión segura de contraseñas con cifrado AES-256

• Desarrollar simulador educativo de ataques de phishing

• Crear escáner de red local para detectar vulnerabilidades

• Diseñar interfaz intuitiva con modo claro/oscuro

• Establecer arquitectura escalable y segura`, {
    x: 1, y: 4.3, w: 11, h: 3,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.dark
  });

  // DIAPOSITIVA 6: TRABAJO DESARROLLADO
  const slide6 = pptx.addSlide();
  slide6.background = { color: colors.light };
  
  slide6.addText('TRABAJO DESARROLLADO', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 32,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center'
  });
  
  slide6.addText('TECNOLOGÍAS IMPLEMENTADAS', {
    x: 0.5, y: 1.6, w: 5.5, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide6.addText(`• Frontend: React + TypeScript
• Backend: Node.js + Express
• Base de Datos: PostgreSQL
• Autenticación: Passport.js
• Estilos: Tailwind CSS`, {
    x: 0.8, y: 2.4, w: 5, h: 2.5,
    fontSize: 13,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide6.addText('FUNCIONALIDADES CLAVE', {
    x: 6.5, y: 1.6, w: 5.5, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide6.addText(`• Sistema de autenticación seguro
• Cifrado de extremo a extremo
• Análisis real de red local
• Detección de phishing interactiva
• Dashboard con métricas`, {
    x: 6.8, y: 2.4, w: 5, h: 2.5,
    fontSize: 13,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide6.addText('MÉTRICAS DEL PROYECTO', {
    x: 0.5, y: 5.2, w: 12, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide6.addText('7,640 líneas de código • 78 archivos • 85% cobertura de testing • Score Lighthouse: 94/100', {
    x: 0.5, y: 5.9, w: 12, h: 0.8,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.dark,
    align: 'center',
    fill: { color: colors.accent, transparency: 20 }
  });

  // DIAPOSITIVA 7: ARQUITECTURA DEL SISTEMA
  const slide7 = pptx.addSlide();
  slide7.background = { color: colors.light };
  
  slide7.addText('ARQUITECTURA DEL SISTEMA', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 32,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center'
  });
  
  // Cajas de arquitectura
  slide7.addText('FRONTEND\n(React + TypeScript)', {
    x: 1, y: 2, w: 3.5, h: 1.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.light,
    bold: true,
    align: 'center',
    fill: { color: colors.primary }
  });
  
  slide7.addText('BACKEND\n(Node.js + Express)', {
    x: 4.75, y: 2, w: 3.5, h: 1.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.light,
    bold: true,
    align: 'center',
    fill: { color: colors.secondary }
  });
  
  slide7.addText('BASE DE DATOS\n(PostgreSQL)', {
    x: 8.5, y: 2, w: 3.5, h: 1.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.light,
    bold: true,
    align: 'center',
    fill: { color: colors.accent }
  });
  
  slide7.addText('CARACTERÍSTICAS TÉCNICAS', {
    x: 0.5, y: 4.2, w: 12, h: 0.6,
    fontSize: 20,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide7.addText(`• Patrón MVC (Model-View-Controller) para separación de responsabilidades

• API REST con middleware de autenticación y validación

• Cifrado AES-256 para datos sensibles con salt único por usuario

• Gestión de sesiones persistentes con PostgreSQL

• Componentes React reutilizables con TypeScript para mayor robustez`, {
    x: 1, y: 5, w: 11, h: 3,
    fontSize: 13,
    fontFace: 'Arial',
    color: colors.dark
  });

  // DIAPOSITIVA 8: MÓDULOS IMPLEMENTADOS
  const slide8 = pptx.addSlide();
  slide8.background = { color: colors.light };
  
  slide8.addText('MÓDULOS IMPLEMENTADOS', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 32,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center'
  });
  
  slide8.addText('1. GESTOR DE CONTRASEÑAS', {
    x: 0.5, y: 1.7, w: 6, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide8.addText(`• Almacenamiento cifrado AES-256
• Generador de contraseñas seguras
• Detección de filtraciones
• Análisis de fortaleza`, {
    x: 0.8, y: 2.3, w: 5.5, h: 1.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide8.addText('2. SIMULADOR DE PHISHING', {
    x: 6.5, y: 1.7, w: 6, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide8.addText(`• Casos reales actualizados
• Evaluación interactiva
• Feedback educativo
• Métricas de progreso`, {
    x: 6.8, y: 2.3, w: 5.5, h: 1.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide8.addText('3. ESCÁNER DE RED LOCAL', {
    x: 0.5, y: 4.2, w: 6, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide8.addText(`• Detección de dispositivos
• Análisis de vulnerabilidades
• Recomendaciones específicas
• Alertas de seguridad`, {
    x: 0.8, y: 4.8, w: 5.5, h: 1.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide8.addText('4. DASHBOARD INTEGRADO', {
    x: 6.5, y: 4.2, w: 6, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide8.addText(`• Métricas consolidadas
• Actividades recientes
• Navegación intuitiva
• Modo claro/oscuro`, {
    x: 6.8, y: 4.8, w: 5.5, h: 1.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide8.addText('INNOVACIONES DESTACADAS', {
    x: 0.5, y: 6.8, w: 12, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide8.addText('Primer escáner de red real para usuarios domésticos • Simulador de phishing educativo integral • Interfaz adaptativa completa', {
    x: 0.5, y: 7.4, w: 12, h: 0.8,
    fontSize: 13,
    fontFace: 'Arial',
    color: colors.dark,
    align: 'center',
    fill: { color: colors.accent, transparency: 20 }
  });

  // DIAPOSITIVA 9: CONCLUSIONES
  const slide9 = pptx.addSlide();
  slide9.background = { color: colors.light };
  
  slide9.addText('CONCLUSIONES', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 36,
    fontFace: 'Arial',
    color: colors.primary,
    bold: true,
    align: 'center'
  });
  
  slide9.addText('LOGROS ALCANZADOS', {
    x: 0.5, y: 1.6, w: 12, h: 0.6,
    fontSize: 20,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide9.addText(`• Democratización exitosa de la ciberseguridad para usuarios no técnicos

• Integración completa de tres módulos complementarios de seguridad

• Arquitectura técnica sólida y escalable con tecnologías modernas

• Experiencia de usuario optimizada con diseño adaptativo

• Impacto educativo significativo en detección de amenazas`, {
    x: 1, y: 2.4, w: 11, h: 3,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  slide9.addText('PERSPECTIVAS FUTURAS', {
    x: 0.5, y: 5.8, w: 12, h: 0.6,
    fontSize: 20,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide9.addText('Expansión a versión empresarial • Integración con APIs de threat intelligence\nImplementación como PWA • Certificación en ciberseguridad básica', {
    x: 0.5, y: 6.5, w: 12, h: 1.2,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.dark,
    align: 'center',
    fill: { color: colors.accent, transparency: 20 }
  });

  // DIAPOSITIVA 10: FUENTES Y DESPEDIDA
  const slide10 = pptx.addSlide();
  slide10.background = { color: colors.primary };
  
  slide10.addText('FUENTES Y REFERENCIAS', {
    x: 0.5, y: 0.5, w: 12, h: 1,
    fontSize: 32,
    fontFace: 'Arial',
    color: colors.light,
    bold: true,
    align: 'center'
  });
  
  slide10.addText('PRINCIPALES FUENTES EMPLEADAS', {
    x: 0.5, y: 1.8, w: 12, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.accent,
    bold: true,
    align: 'center'
  });
  
  slide10.addText(`• OWASP Foundation - Top 10 Web Application Security Risks

• NIST Cybersecurity Framework 2.0

• Verizon 2024 Data Breach Investigations Report

• React, Node.js y PostgreSQL Documentation

• Informes de Ciberseguridad Nacional 2024`, {
    x: 1, y: 2.6, w: 11, h: 2.5,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.light
  });
  
  slide10.addText('APORTACIONES DEL PROYECTO', {
    x: 0.5, y: 5.2, w: 12, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.accent,
    bold: true,
    align: 'center'
  });
  
  slide10.addText(`• Primer escáner de red doméstico accesible
• Metodología educativa integrada en ciberseguridad
• Arquitectura de referencia para aplicaciones de seguridad`, {
    x: 1, y: 5.9, w: 11, h: 1.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.light
  });
  
  slide10.addText('GRACIAS POR SU ATENCIÓN', {
    x: 0.5, y: 7.8, w: 12, h: 0.8,
    fontSize: 24,
    fontFace: 'Arial',
    color: colors.accent,
    bold: true,
    align: 'center'
  });

  return pptx;
}

// Generar PDF desde la presentación
async function generatePresentationAsPDF() {
  try {
    console.log('Creando presentación CyberShield TFG para PDF...');
    const pptx = createCyberShieldPresentationForPDF();
    
    // Guardar como PDF usando la funcionalidad integrada
    await pptx.writeFile({ fileName: 'CyberShield_Presentacion_TFG.pdf', outputType: 'arraybuffer' });
    console.log('✅ Presentación PDF generada: CyberShield_Presentacion_TFG.pdf');
    
  } catch (error) {
    console.error('❌ Error al generar la presentación PDF:', error);
    
    // Alternativa: generar solo PowerPoint
    console.log('Generando solo PowerPoint...');
    const pptx = createCyberShieldPresentationForPDF();
    await pptx.writeFile({ fileName: 'CyberShield_Presentacion_TFG_Alt.pptx' });
    console.log('✅ Presentación PowerPoint alternativa generada: CyberShield_Presentacion_TFG_Alt.pptx');
  }
}

// Ejecutar
generatePresentationAsPDF();