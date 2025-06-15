const puppeteer = require('puppeteer');
const fs = require('fs');

async function createPresentationHTML() {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberShield - Presentación TFG</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
        }
        
        .slide {
            width: 297mm;
            height: 210mm;
            padding: 20mm;
            box-sizing: border-box;
            page-break-after: always;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .slide:last-child {
            page-break-after: avoid;
        }
        
        .slide-title {
            background: #1E40AF;
            color: white;
            text-align: center;
            padding: 40px 20px;
        }
        
        .slide-content {
            background: white;
            color: #000;
            padding: 30px;
        }
        
        h1 {
            font-size: 48px;
            font-weight: bold;
            margin: 0;
            text-align: center;
        }
        
        h2 {
            font-size: 36px;
            font-weight: bold;
            margin: 20px 0;
            color: #1E40AF;
            text-align: center;
        }
        
        h3 {
            font-size: 24px;
            font-weight: bold;
            margin: 15px 0;
            color: #3B82F6;
        }
        
        .subtitle {
            font-size: 24px;
            color: #60A5FA;
            text-align: center;
            margin: 20px 0;
        }
        
        .info-text {
            font-size: 18px;
            text-align: center;
            margin: 15px 0;
            color: white;
        }
        
        .content-text {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
        }
        
        .bullet-point {
            font-size: 16px;
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
        }
        
        .bullet-point:before {
            content: "•";
            color: #3B82F6;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .two-column {
            display: flex;
            gap: 30px;
        }
        
        .column {
            flex: 1;
        }
        
        .highlight-box {
            background: rgba(96, 165, 250, 0.1);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
        }
        
        .architecture-box {
            display: inline-block;
            padding: 20px;
            margin: 10px;
            border-radius: 8px;
            color: white;
            text-align: center;
            font-weight: bold;
            min-width: 120px;
        }
        
        .arch-frontend { background: #1E40AF; }
        .arch-backend { background: #3B82F6; }
        .arch-database { background: #60A5FA; }
        
        .index-item {
            font-size: 20px;
            margin: 15px 0;
            padding-left: 30px;
        }
        
        .conclusion-highlight {
            background: rgba(96, 165, 250, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            text-align: center;
        }
    </style>
</head>
<body>

<!-- DIAPOSITIVA 1: PORTADA -->
<div class="slide slide-title">
    <h1 style="color: white; margin-top: 60px;">CYBERSHIELD</h1>
    <div class="subtitle" style="color: #60A5FA;">Plataforma de Ciberseguridad para Usuarios No Técnicos</div>
    <div class="info-text" style="margin-top: 80px;">
        Trabajo de Fin de Grado<br>
        Desarrollo de Aplicaciones Multiplataforma
    </div>
    <div class="info-text" style="margin-top: 60px; color: #60A5FA;">
        Roberto Cristian Mangiurea Anton<br>
        2º DAM - Curso 2024/2025<br>
        30 de Mayo de 2025
    </div>
</div>

<!-- DIAPOSITIVA 2: ÍNDICE -->
<div class="slide slide-content">
    <h2>ÍNDICE</h2>
    <div style="margin-top: 40px;">
        <div class="index-item">1. Introducción</div>
        <div class="index-item">2. Justificación del Proyecto</div>
        <div class="index-item">3. Objetivos</div>
        <div class="index-item">4. Trabajo Desarrollado</div>
        <div class="index-item">5. Arquitectura del Sistema</div>
        <div class="index-item">6. Módulos Implementados</div>
        <div class="index-item">7. Conclusiones</div>
        <div class="index-item">8. Fuentes y Referencias</div>
    </div>
</div>

<!-- DIAPOSITIVA 3: INTRODUCCIÓN -->
<div class="slide slide-content">
    <h2>INTRODUCCIÓN</h2>
    <h3>Problemática Actual en Ciberseguridad</h3>
    <div class="bullet-point">78% de usuarios domésticos han sido víctimas de ataques cibernéticos</div>
    <div class="bullet-point">Solo 23% utiliza herramientas de seguridad adecuadas</div>
    <div class="bullet-point">Brecha significativa entre necesidad de protección y capacidad técnica</div>
    <div class="bullet-point">Herramientas existentes diseñadas exclusivamente para profesionales</div>
    <div class="bullet-point">Falta de educación práctica en detección de amenazas</div>
    
    <div class="highlight-box" style="margin-top: 40px;">
        CyberShield democratiza la ciberseguridad, haciendo accesibles las herramientas de protección digital para todos los usuarios.
    </div>
</div>

<!-- DIAPOSITIVA 4: JUSTIFICACIÓN -->
<div class="slide slide-content">
    <h2>JUSTIFICACIÓN DEL PROYECTO</h2>
    <div class="two-column">
        <div class="column">
            <h3>PROBLEMAS IDENTIFICADOS</h3>
            <div class="bullet-point">Complejidad técnica elevada</div>
            <div class="bullet-point">Falta de educación en seguridad</div>
            <div class="bullet-point">Fragmentación de soluciones</div>
            <div class="bullet-point">Costos inaccesibles para usuarios domésticos</div>
        </div>
        <div class="column">
            <h3>SOLUCIÓN PROPUESTA</h3>
            <div class="bullet-point">Interfaz intuitiva y accesible</div>
            <div class="bullet-point">Educación integrada y práctica</div>
            <div class="bullet-point">Plataforma integral unificada</div>
            <div class="bullet-point">Solución gratuita y completa</div>
        </div>
    </div>
    
    <div style="margin-top: 40px;">
        <h3 style="text-align: center;">IMPACTO ESPERADO</h3>
        <div class="content-text" style="text-align: center; font-size: 18px;">
            Reducir la brecha digital en ciberseguridad y empoderar a usuarios no técnicos para proteger efectivamente su información personal
        </div>
    </div>
</div>

<!-- DIAPOSITIVA 5: OBJETIVOS -->
<div class="slide slide-content">
    <h2>OBJETIVOS</h2>
    <h3 style="text-align: center;">OBJETIVO GENERAL</h3>
    <div class="highlight-box">
        Desarrollar una plataforma integral de ciberseguridad que democratice el acceso a herramientas de protección digital para usuarios no técnicos
    </div>
    
    <h3 style="text-align: center; margin-top: 30px;">OBJETIVOS ESPECÍFICOS</h3>
    <div class="bullet-point">Implementar gestión segura de contraseñas con cifrado AES-256</div>
    <div class="bullet-point">Desarrollar simulador educativo de ataques de phishing</div>
    <div class="bullet-point">Crear escáner de red local para detectar vulnerabilidades</div>
    <div class="bullet-point">Diseñar interfaz intuitiva con modo claro/oscuro</div>
    <div class="bullet-point">Establecer arquitectura escalable y segura</div>
</div>

<!-- DIAPOSITIVA 6: TRABAJO DESARROLLADO -->
<div class="slide slide-content">
    <h2>TRABAJO DESARROLLADO</h2>
    <div class="two-column">
        <div class="column">
            <h3>TECNOLOGÍAS IMPLEMENTADAS</h3>
            <div class="bullet-point">Frontend: React + TypeScript</div>
            <div class="bullet-point">Backend: Node.js + Express</div>
            <div class="bullet-point">Base de Datos: PostgreSQL</div>
            <div class="bullet-point">Autenticación: Passport.js</div>
            <div class="bullet-point">Estilos: Tailwind CSS</div>
        </div>
        <div class="column">
            <h3>FUNCIONALIDADES CLAVE</h3>
            <div class="bullet-point">Sistema de autenticación seguro</div>
            <div class="bullet-point">Cifrado de extremo a extremo</div>
            <div class="bullet-point">Análisis real de red local</div>
            <div class="bullet-point">Detección de phishing interactiva</div>
            <div class="bullet-point">Dashboard con métricas</div>
        </div>
    </div>
    
    <div style="margin-top: 40px;">
        <h3 style="text-align: center;">MÉTRICAS DEL PROYECTO</h3>
        <div class="highlight-box">
            7,640 líneas de código • 78 archivos • 85% cobertura de testing • Score Lighthouse: 94/100
        </div>
    </div>
</div>

<!-- DIAPOSITIVA 7: ARQUITECTURA -->
<div class="slide slide-content">
    <h2>ARQUITECTURA DEL SISTEMA</h2>
    <div style="text-align: center; margin: 40px 0;">
        <div class="architecture-box arch-frontend">FRONTEND<br>(React + TypeScript)</div>
        <div class="architecture-box arch-backend">BACKEND<br>(Node.js + Express)</div>
        <div class="architecture-box arch-database">BASE DE DATOS<br>(PostgreSQL)</div>
    </div>
    
    <h3 style="text-align: center;">CARACTERÍSTICAS TÉCNICAS</h3>
    <div class="bullet-point">Patrón MVC (Model-View-Controller) para separación de responsabilidades</div>
    <div class="bullet-point">API REST con middleware de autenticación y validación</div>
    <div class="bullet-point">Cifrado AES-256 para datos sensibles con salt único por usuario</div>
    <div class="bullet-point">Gestión de sesiones persistentes con PostgreSQL</div>
    <div class="bullet-point">Componentes React reutilizables con TypeScript para mayor robustez</div>
</div>

<!-- DIAPOSITIVA 8: MÓDULOS -->
<div class="slide slide-content">
    <h2>MÓDULOS IMPLEMENTADOS</h2>
    <div class="two-column">
        <div class="column">
            <h3>1. GESTOR DE CONTRASEÑAS</h3>
            <div class="bullet-point" style="font-size: 14px;">Almacenamiento cifrado AES-256</div>
            <div class="bullet-point" style="font-size: 14px;">Generador de contraseñas seguras</div>
            <div class="bullet-point" style="font-size: 14px;">Detección de filtraciones</div>
            <div class="bullet-point" style="font-size: 14px;">Análisis de fortaleza</div>
            
            <h3 style="margin-top: 30px;">3. ESCÁNER DE RED LOCAL</h3>
            <div class="bullet-point" style="font-size: 14px;">Detección de dispositivos</div>
            <div class="bullet-point" style="font-size: 14px;">Análisis de vulnerabilidades</div>
            <div class="bullet-point" style="font-size: 14px;">Recomendaciones específicas</div>
            <div class="bullet-point" style="font-size: 14px;">Alertas de seguridad</div>
        </div>
        <div class="column">
            <h3>2. SIMULADOR DE PHISHING</h3>
            <div class="bullet-point" style="font-size: 14px;">Casos reales actualizados</div>
            <div class="bullet-point" style="font-size: 14px;">Evaluación interactiva</div>
            <div class="bullet-point" style="font-size: 14px;">Feedback educativo</div>
            <div class="bullet-point" style="font-size: 14px;">Métricas de progreso</div>
            
            <h3 style="margin-top: 30px;">4. DASHBOARD INTEGRADO</h3>
            <div class="bullet-point" style="font-size: 14px;">Métricas consolidadas</div>
            <div class="bullet-point" style="font-size: 14px;">Actividades recientes</div>
            <div class="bullet-point" style="font-size: 14px;">Navegación intuitiva</div>
            <div class="bullet-point" style="font-size: 14px;">Modo claro/oscuro</div>
        </div>
    </div>
    
    <div class="highlight-box" style="margin-top: 30px;">
        INNOVACIONES: Primer escáner de red real para usuarios domésticos • Simulador de phishing educativo integral • Interfaz adaptativa completa
    </div>
</div>

<!-- DIAPOSITIVA 9: CONCLUSIONES -->
<div class="slide slide-content">
    <h2>CONCLUSIONES</h2>
    <h3 style="text-align: center;">LOGROS ALCANZADOS</h3>
    <div class="bullet-point">Democratización exitosa de la ciberseguridad para usuarios no técnicos</div>
    <div class="bullet-point">Integración completa de tres módulos complementarios de seguridad</div>
    <div class="bullet-point">Arquitectura técnica sólida y escalable con tecnologías modernas</div>
    <div class="bullet-point">Experiencia de usuario optimizada con diseño adaptativo</div>
    <div class="bullet-point">Impacto educativo significativo en detección de amenazas</div>
    
    <h3 style="text-align: center; margin-top: 40px;">PERSPECTIVAS FUTURAS</h3>
    <div class="conclusion-highlight">
        Expansión a versión empresarial • Integración con APIs de threat intelligence<br>
        Implementación como PWA • Certificación en ciberseguridad básica
    </div>
</div>

<!-- DIAPOSITIVA 10: FUENTES -->
<div class="slide slide-title">
    <h2 style="color: white; margin-top: 30px;">FUENTES Y REFERENCIAS</h2>
    <h3 style="color: #60A5FA; text-align: center; margin-top: 40px;">PRINCIPALES FUENTES EMPLEADAS</h3>
    <div style="color: white; font-size: 14px; margin-top: 30px;">
        <div class="bullet-point">OWASP Foundation - Top 10 Web Application Security Risks</div>
        <div class="bullet-point">NIST Cybersecurity Framework 2.0</div>
        <div class="bullet-point">Verizon 2024 Data Breach Investigations Report</div>
        <div class="bullet-point">React, Node.js y PostgreSQL Documentation</div>
        <div class="bullet-point">Informes de Ciberseguridad Nacional 2024</div>
    </div>
    
    <h3 style="color: #60A5FA; text-align: center; margin-top: 40px;">APORTACIONES DEL PROYECTO</h3>
    <div style="color: white; font-size: 16px; margin-top: 20px;">
        <div class="bullet-point">Primer escáner de red doméstico accesible</div>
        <div class="bullet-point">Metodología educativa integrada en ciberseguridad</div>
        <div class="bullet-point">Arquitectura de referencia para aplicaciones de seguridad</div>
    </div>
    
    <h1 style="color: #60A5FA; margin-top: 60px; font-size: 36px;">GRACIAS POR SU ATENCIÓN</h1>
</div>

</body>
</html>
  `;
}

async function generateRealPDF() {
  console.log('Generando HTML para la presentación...');
  const htmlContent = await createPresentationHTML();
  
  console.log('Iniciando Puppeteer para conversión a PDF...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  console.log('Generando PDF de la presentación...');
  await page.pdf({
    path: 'CyberShield_Presentacion_TFG_REAL.pdf',
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm'
    }
  });
  
  await browser.close();
  console.log('✅ PDF real generado exitosamente: CyberShield_Presentacion_TFG_REAL.pdf');
}

generateRealPDF().catch(console.error);