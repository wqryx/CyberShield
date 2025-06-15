import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Función para actualizar el estado basado en el tamaño de la ventana
    const updateViewportDimensions = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640); // Tamaño móvil (sm en Tailwind)
      setIsTablet(width >= 640 && width < 1024); // Tamaño tablet (entre sm y lg en Tailwind)
    };

    // Actualizar en el montaje del componente
    updateViewportDimensions();

    // Añadir listener para cambios de tamaño
    window.addEventListener('resize', updateViewportDimensions);

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', updateViewportDimensions);
    };
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
}