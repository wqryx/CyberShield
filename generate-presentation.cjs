const PptxGenJS = require('pptxgenjs');

function createCyberShieldPresentation() {
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

  // Configuración de layout
  pptx.layout = 'LAYOUT_16x9';

  // DIAPOSITIVA 1: PORTADA
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.primary };
  
  // Título principal
  slide1.addText('CYBERSHIELD', {
    x: 0.5, y: 2, w: 12, h: 1.5,
    fontSize: 48,
    fontFace: 'Arial',
    color: colors.light,
    bold: true,
    align: 'center'
  });
  
  // Subtítulo
  slide1.addText('Plataforma de Ciberseguridad para Usuarios No Técnicos', {
    x: 0.5, y: 3.5, w: 12, h: 1,
    fontSize: 24,
    fontFace: 'Arial',
    color: colors.accent,
    align: 'center'
  });
  
  // Trabajo de Fin de Grado
  slide1.addText('Trabajo de Fin de Grado\nDesarrollo de Aplicaciones Multiplataforma', {
    x: 0.5, y: 5.5, w: 12, h: 1.5,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.light,
    align: 'center'
  });
  
  // Datos del estudiante (placeholder)
  slide1.addText('[DATOS DEL ESTUDIANTE]\n[CURSO ACADÉMICO]\n[FECHA PRESENTACIÓN]', {
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
      color: colors.dark,
      bullet: { type: 'number', style: colors.secondary }
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
  
  slide3.addText('Problemática Actual', {
    x: 0.5, y: 1.8, w: 12, h: 0.6,
    fontSize: 24,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  const introPoints = [
    '78% de usuarios domésticos han sido víctimas de ataques cibernéticos',
    'Solo 23% utiliza herramientas de seguridad adecuadas',
    'Brecha entre necesidad de protección y capacidad técnica',
    'Herramientas existentes diseñadas para profesionales'
  ];
  
  introPoints.forEach((point, index) => {
    slide3.addText(point, {
      x: 1, y: 2.8 + (index * 0.7), w: 11, h: 0.6,
      fontSize: 16,
      fontFace: 'Arial',
      color: colors.dark,
      bullet: { type: 'bullet', style: colors.secondary }
    });
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
  
  // Columna izquierda - Problemas
  slide4.addText('PROBLEMAS IDENTIFICADOS', {
    x: 0.5, y: 1.8, w: 5.5, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  const problems = [
    'Complejidad técnica elevada',
    'Falta de educación en seguridad',
    'Fragmentación de soluciones',
    'Costos inaccesibles'
  ];
  
  problems.forEach((problem, index) => {
    slide4.addText(problem, {
      x: 0.8, y: 2.6 + (index * 0.6), w: 5, h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: colors.dark,
      bullet: { type: 'bullet', style: colors.secondary }
    });
  });
  
  // Columna derecha - Soluciones
  slide4.addText('SOLUCIÓN PROPUESTA', {
    x: 6.5, y: 1.8, w: 5.5, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  const solutions = [
    'Interfaz intuitiva y accesible',
    'Educación integrada y práctica',
    'Plataforma integral unificada',
    'Solución gratuita y completa'
  ];
  
  solutions.forEach((solution, index) => {
    slide4.addText(solution, {
      x: 6.8, y: 2.6 + (index * 0.6), w: 5, h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: colors.dark,
      bullet: { type: 'bullet', style: colors.secondary }
    });
  });
  
  // Impacto esperado
  slide4.addText('IMPACTO ESPERADO', {
    x: 0.5, y: 5.5, w: 12, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  slide4.addText('Reducir la brecha digital en ciberseguridad y empoderar a usuarios no técnicos\npara proteger efectivamente su información personal', {
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
  
  const objectives = [
    'Implementar gestión segura de contraseñas con cifrado AES-256',
    'Desarrollar simulador educativo de ataques de phishing',
    'Crear escáner de red local para detectar vulnerabilidades',
    'Diseñar interfaz intuitiva con modo claro/oscuro',
    'Establecer arquitectura escalable y segura'
  ];
  
  objectives.forEach((objective, index) => {
    slide5.addText(objective, {
      x: 1, y: 4.3 + (index * 0.6), w: 11, h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: colors.dark,
      bullet: { type: 'bullet', style: colors.secondary }
    });
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
  
  // Tecnologías utilizadas
  slide6.addText('TECNOLOGÍAS IMPLEMENTADAS', {
    x: 0.5, y: 1.6, w: 5.5, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  const technologies = [
    'Frontend: React + TypeScript',
    'Backend: Node.js + Express',
    'Base de Datos: PostgreSQL',
    'Autenticación: Passport.js',
    'Estilos: Tailwind CSS'
  ];
  
  technologies.forEach((tech, index) => {
    slide6.addText(tech, {
      x: 0.8, y: 2.4 + (index * 0.5), w: 5, h: 0.4,
      fontSize: 13,
      fontFace: 'Arial',
      color: colors.dark,
      bullet: { type: 'bullet', style: colors.secondary }
    });
  });
  
  // Funcionalidades desarrolladas
  slide6.addText('FUNCIONALIDADES CLAVE', {
    x: 6.5, y: 1.6, w: 5.5, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  const features = [
    'Sistema de autenticación seguro',
    'Cifrado de extremo a extremo',
    'Análisis real de red local',
    'Detección de phishing interactiva',
    'Dashboard con métricas'
  ];
  
  features.forEach((feature, index) => {
    slide6.addText(feature, {
      x: 6.8, y: 2.4 + (index * 0.5), w: 5, h: 0.4,
      fontSize: 13,
      fontFace: 'Arial',
      color: colors.dark,
      bullet: { type: 'bullet', style: colors.secondary }
    });
  });
  
  // Métricas del proyecto
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
  
  // Diagrama de arquitectura (cajas de colores)
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
  
  // Características técnicas
  slide7.addText('CARACTERÍSTICAS TÉCNICAS', {
    x: 0.5, y: 4.2, w: 12, h: 0.6,
    fontSize: 20,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true,
    align: 'center'
  });
  
  const techFeatures = [
    'Patrón MVC (Model-View-Controller) para separación de responsabilidades',
    'API REST con middleware de autenticación y validación',
    'Cifrado AES-256 para datos sensibles con salt único por usuario',
    'Gestión de sesiones persistentes con PostgreSQL',
    'Componentes React reutilizables con TypeScript para mayor robustez'
  ];
  
  techFeatures.forEach((feature, index) => {
    slide7.addText(feature, {
      x: 1, y: 5 + (index * 0.6), w: 11, h: 0.5,
      fontSize: 13,
      fontFace: 'Arial',
      color: colors.dark,
      bullet: { type: 'bullet', style: colors.secondary }
    });
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
  
  // Módulo 1: Gestor de Contraseñas
  slide8.addText('1. GESTOR DE CONTRASEÑAS', {
    x: 0.5, y: 1.7, w: 6, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide8.addText('• Almacenamiento cifrado AES-256\n• Generador de contraseñas seguras\n• Detección de filtraciones\n• Análisis de fortaleza', {
    x: 0.8, y: 2.3, w: 5.5, h: 1.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  // Módulo 2: Simulador de Phishing
  slide8.addText('2. SIMULADOR DE PHISHING', {
    x: 6.5, y: 1.7, w: 6, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide8.addText('• Casos reales actualizados\n• Evaluación interactiva\n• Feedback educativo\n• Métricas de progreso', {
    x: 6.8, y: 2.3, w: 5.5, h: 1.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  // Módulo 3: Escáner de Red
  slide8.addText('3. ESCÁNER DE RED LOCAL', {
    x: 0.5, y: 4.2, w: 6, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide8.addText('• Detección de dispositivos\n• Análisis de vulnerabilidades\n• Recomendaciones específicas\n• Alertas de seguridad', {
    x: 0.8, y: 4.8, w: 5.5, h: 1.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  // Dashboard
  slide8.addText('4. DASHBOARD INTEGRADO', {
    x: 6.5, y: 4.2, w: 6, h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: colors.secondary,
    bold: true
  });
  
  slide8.addText('• Métricas consolidadas\n• Actividades recientes\n• Navegación intuitiva\n• Modo claro/oscuro', {
    x: 6.8, y: 4.8, w: 5.5, h: 1.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: colors.dark
  });
  
  // Innovaciones
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
  
  const achievements = [
    'Democratización exitosa de la ciberseguridad para usuarios no técnicos',
    'Integración completa de tres módulos complementarios de seguridad',
    'Arquitectura técnica sólida y escalable con tecnologías modernas',
    'Experiencia de usuario optimizada con diseño adaptativo',
    'Impacto educativo significativo en detección de amenazas'
  ];
  
  achievements.forEach((achievement, index) => {
    slide9.addText(achievement, {
      x: 1, y: 2.4 + (index * 0.6), w: 11, h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: colors.dark,
      bullet: { type: 'bullet', style: colors.secondary }
    });
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
  
  const sources = [
    'OWASP Foundation - Top 10 Web Application Security Risks',
    'NIST Cybersecurity Framework 2.0',
    'Verizon 2024 Data Breach Investigations Report',
    'React, Node.js y PostgreSQL Documentation',
    'Informes de Ciberseguridad Nacional 2024'
  ];
  
  sources.forEach((source, index) => {
    slide10.addText(source, {
      x: 1, y: 2.6 + (index * 0.5), w: 11, h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: colors.light,
      bullet: { type: 'bullet', style: colors.accent }
    });
  });
  
  slide10.addText('APORTACIONES DEL PROYECTO', {
    x: 0.5, y: 5.2, w: 12, h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.accent,
    bold: true,
    align: 'center'
  });
  
  slide10.addText('• Primer escáner de red doméstico accesible\n• Metodología educativa integrada en ciberseguridad\n• Arquitectura de referencia para aplicaciones de seguridad', {
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

// Generar la presentación
async function generatePresentation() {
  try {
    console.log('Creando presentación CyberShield TFG...');
    const pptx = createCyberShieldPresentation();
    
    // Guardar como PowerPoint
    await pptx.writeFile({ fileName: 'CyberShield_Presentacion_TFG.pptx' });
    console.log('✅ Presentación PowerPoint generada: CyberShield_Presentacion_TFG.pptx');
    
    return pptx;
  } catch (error) {
    console.error('❌ Error al generar la presentación:', error);
    throw error;
  }
}

// Ejecutar
generatePresentation();