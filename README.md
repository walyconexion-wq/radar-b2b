# 📡 RADAR B2B - COMPETITOR INTEL & PRICE PIPELINE OPS

> **Solución B2B de Inteligencia Competitiva y Monitoreo de Precios en Tiempo Real.**  
> Diseñado y operado por **Walter & Luz** en **Antigravity 2.0**.

---

## 🚀 Arquitectura Frontend de Élite
Este repositorio implementa la combinación de nuestros superpoderes de diseño:
* **Landy Pattern (Desacople de Contenido):** Todo el contenido textual, planes de precios, testimonios, FAQs y números viven en `content.json`. Podés actualizar cualquier dato en 30 segundos sin tocar una sola línea de HTML o JavaScript.
* **Launch UI & Shadcnspace Layouts:** Estructura de alta conversión inspirada en Stripe, Vercel y Linear (Hero, Grilla de características modulares, Tablas de precios limpias, FAQs en acordeón).
* **Kokonut UI Micro-interactions:** Resplandor magnético interactivo en tarjetas (`.glass-card::before` con tracking de mouse), tickers animados y badges de estado en vivo.
* **Interactive Tooling:** Calculadora de ROI / Margen comercial en tiempo real y simulador interactivo de alertas de Telegram.

---

## 📂 Estructura del Repositorio
```
radar-b2b-saas/
├── index.html       # Landing page maestra con Tailwind CSS y componentes modulares
├── content.json     # Base de datos de contenido, precios, textos y preguntas frecuentes
├── app.js           # Motor de hidratación dinámica, microinteracciones y calculadora
├── vercel.json      # Configuración de despliegue, URLs limpias y cabeceras de seguridad
└── README.md        # Documentación oficial del búnker
```

---

## 🛠️ Cómo Editar Contenidos (Superpoder Landy)
Para cambiar un precio, editar un texto o sumar un competidor:
1. Abrí `content.json`.
2. Modificá el campo deseado (ej. cambiar `"price": "$650"` a `"price": "$700"`).
3. Hacé `git commit` y `git push`. Vercel actualiza la web automáticamente en 10 segundos.

---

## 🌐 Despliegue en Vercel
Este proyecto está 100% listo para producción. Se puede conectar directamente a Vercel importando el repositorio de GitHub:
* Framework Preset: **Other** (Static)
* Output Directory: `.` (Raíz)
* Dominio gratuito sugerido: `radar-b2b.vercel.app` o similar.
