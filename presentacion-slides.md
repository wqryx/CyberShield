# CYBERSHIELD
## Plataforma de Ciberseguridad para Usuarios No Técnicos

**Trabajo de Fin de Grado**  
**Desarrollo de Aplicaciones Multiplataforma**

Roberto Cristian Mangiurea Anton  
2º DAM - Curso 2024/2025  
30 de Mayo de 2025

---

# ÍNDICE

1. Introducción
2. Justificación del Proyecto  
3. Objetivos
4. Trabajo Desarrollado
5. Arquitectura del Sistema
6. Módulos Implementados
7. Conclusiones
8. Fuentes y Referencias

---

# INTRODUCCIÓN

## Problemática Actual en Ciberseguridad

• **78%** de usuarios domésticos han sido víctimas de ataques cibernéticos

• Solo **23%** utiliza herramientas de seguridad adecuadas

• **Brecha significativa** entre necesidad de protección y capacidad técnica

• Herramientas existentes diseñadas **exclusivamente para profesionales**

• **Falta de educación práctica** en detección de amenazas

### Solución CyberShield
*CyberShield democratiza la ciberseguridad, haciendo accesibles las herramientas de protección digital para todos los usuarios.*

---

# JUSTIFICACIÓN DEL PROYECTO

## PROBLEMAS IDENTIFICADOS

• **Complejidad técnica elevada**
• **Falta de educación** en seguridad
• **Fragmentación de soluciones**
• **Costos inaccesibles** para usuarios domésticos

## SOLUCIÓN PROPUESTA

• **Interfaz intuitiva** y accesible
• **Educación integrada** y práctica
• **Plataforma integral** unificada
• **Solución gratuita** y completa

### IMPACTO ESPERADO
Reducir la brecha digital en ciberseguridad y empoderar a usuarios no técnicos para proteger efectivamente su información personal

---

# OBJETIVOS

## OBJETIVO GENERAL

**Desarrollar una plataforma integral de ciberseguridad que democratice el acceso a herramientas de protección digital para usuarios no técnicos**

## OBJETIVOS ESPECÍFICOS

• Implementar **gestión segura de contraseñas** con cifrado AES-256

• Desarrollar **simulador educativo** de ataques de phishing

• Crear **escáner de red local** para detectar vulnerabilidades

• Diseñar **interfaz intuitiva** con modo claro/oscuro

• Establecer **arquitectura escalable** y segura

---

# TRABAJO DESARROLLADO

## TECNOLOGÍAS IMPLEMENTADAS

• **Frontend:** React + TypeScript
• **Backend:** Node.js + Express
• **Base de Datos:** PostgreSQL
• **Autenticación:** Passport.js
• **Estilos:** Tailwind CSS

## FUNCIONALIDADES CLAVE

• **Sistema de autenticación** seguro
• **Cifrado de extremo a extremo**
• **Análisis real** de red local
• **Detección de phishing** interactiva
• **Dashboard** con métricas

### MÉTRICAS DEL PROYECTO
**7,640** líneas de código • **78** archivos • **85%** cobertura de testing • Score Lighthouse: **94/100**

---

# ARQUITECTURA DEL SISTEMA

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │◄──►│    BACKEND      │◄──►│  BASE DE DATOS  │
│ React+TypeScript│    │  Node.js+Express│    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## CARACTERÍSTICAS TÉCNICAS

• **Patrón MVC** (Model-View-Controller) para separación de responsabilidades

• **API REST** con middleware de autenticación y validación

• **Cifrado AES-256** para datos sensibles con salt único por usuario

• **Gestión de sesiones** persistentes con PostgreSQL

• **Componentes React** reutilizables con TypeScript para mayor robustez

---

# MÓDULOS IMPLEMENTADOS

## 1. GESTOR DE CONTRASEÑAS
• Almacenamiento cifrado AES-256
• Generador de contraseñas seguras
• Detección de filtraciones
• Análisis de fortaleza

## 2. SIMULADOR DE PHISHING
• Casos reales actualizados
• Evaluación interactiva
• Feedback educativo
• Métricas de progreso

## 3. ESCÁNER DE RED LOCAL
• Detección de dispositivos
• Análisis de vulnerabilidades
• Recomendaciones específicas
• Alertas de seguridad

## 4. DASHBOARD INTEGRADO
• Métricas consolidadas
• Actividades recientes
• Navegación intuitiva
• Modo claro/oscuro

### INNOVACIONES DESTACADAS
**Primer escáner de red real para usuarios domésticos** • **Simulador de phishing educativo integral** • **Interfaz adaptativa completa**

---

# CONCLUSIONES

## LOGROS ALCANZADOS

• **Democratización exitosa** de la ciberseguridad para usuarios no técnicos

• **Integración completa** de tres módulos complementarios de seguridad

• **Arquitectura técnica sólida** y escalable con tecnologías modernas

• **Experiencia de usuario optimizada** con diseño adaptativo

• **Impacto educativo significativo** en detección de amenazas

## PERSPECTIVAS FUTURAS

**Expansión a versión empresarial** • **Integración con APIs de threat intelligence**

**Implementación como PWA** • **Certificación en ciberseguridad básica**

---

# FUENTES Y REFERENCIAS

## PRINCIPALES FUENTES EMPLEADAS

• **OWASP Foundation** - Top 10 Web Application Security Risks

• **NIST** Cybersecurity Framework 2.0

• **Verizon** 2024 Data Breach Investigations Report

• **React, Node.js y PostgreSQL** Documentation

• **Informes de Ciberseguridad Nacional** 2024

## APORTACIONES DEL PROYECTO

• **Primer escáner de red doméstico** accesible

• **Metodología educativa integrada** en ciberseguridad

• **Arquitectura de referencia** para aplicaciones de seguridad

---

# GRACIAS POR SU ATENCIÓN

**CyberShield: Democratizando la Ciberseguridad**

*Trabajo de Fin de Grado - DAM 2025*