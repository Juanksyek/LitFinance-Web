import React, { useState, useEffect } from 'react';

const SECRET_SEQUENCE = 'admin2025litfinance';

export const SecretAccessDebug: React.FC = () => {
  const [sequenceBuffer, setSequenceBuffer] = useState('');
  const [keyHistory, setKeyHistory] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const char = event.key.toLowerCase();
      
      setKeyHistory(prev => [...prev.slice(-10), char]);
      
      setSequenceBuffer(prev => {
        const newBuffer = (prev + char).slice(-SECRET_SEQUENCE.length);
        
        if (newBuffer === SECRET_SEQUENCE) {
          setIsActive(true);
          setTimeout(() => setIsActive(false), 3000);
          console.log('SECUENCIA SECRETA ACTIVADA!');
        }
        
        return newBuffer;
      });
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!import.meta.env.DEV) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 10000,
        maxWidth: '300px'
      }}
    >
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
        Debug: Acceso Secreto
      </div>
      
      <div>
        <strong>Buffer actual:</strong> "{sequenceBuffer}"
      </div>
      
      <div>
        <strong>Objetivo:</strong> "{SECRET_SEQUENCE}"
      </div>
      
      <div>
        <strong>Progreso:</strong> {sequenceBuffer.length}/{SECRET_SEQUENCE.length}
      </div>
      
      <div>
        <strong>Últimas teclas:</strong> {keyHistory.slice(-5).join(', ')}
      </div>
      
      {isActive && (
        <div style={{ color: '#00ff00', fontWeight: 'bold' }}>
          ✅ ¡SECUENCIA ACTIVADA!
        </div>
      )}
      
      <div style={{ fontSize: '10px', color: '#888', marginTop: '5px' }}>
        Presiona: {SECRET_SEQUENCE}
      </div>
    </div>
  );
};
