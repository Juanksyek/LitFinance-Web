
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-justify">
      <h1 className="text-3xl font-bold mb-4">Aviso de Privacidad</h1>
      <p className="mb-4">
        En <strong>LitFinance</strong>, la protección de sus datos personales es
        fundamental. Este Aviso de Privacidad describe cómo recopilamos, usamos,
        almacenamos y protegemos su información.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Datos que Recopilamos</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Nombre completo, correo electrónico y contraseña cifrada.</li>
        <li>Información de cuentas, subcuentas y transacciones registradas.</li>
        <li>Preferencias de notificaciones y configuración de la app.</li>
        <li>Datos técnicos (IP, dispositivo, sistema operativo) para seguridad.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Finalidad del Tratamiento</h2>
      <p className="mb-4">
        Sus datos se utilizan exclusivamente para:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Gestionar su cuenta y funcionalidades de la aplicación.</li>
        <li>Enviar notificaciones relacionadas con movimientos y recurrentes.</li>
        <li>Mejorar la seguridad y experiencia del usuario.</li>
        <li>Cumplir con obligaciones legales aplicables.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Transferencia de Datos</h2>
      <p className="mb-4">
        No compartimos sus datos con terceros, salvo que sea requerido por ley o
        autoridad competente.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Derechos ARCO</h2>
      <p className="mb-4">
        Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al uso de
        sus datos personales. Para ejercer estos derechos, contáctenos en:{" "}
        <a href="mailto:soporte@litfinance.com" className="text-blue-600 underline">
          soporte@litfinance.com
        </a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Seguridad</h2>
      <p className="mb-4">
        Implementamos medidas técnicas, administrativas y físicas para proteger su
        información contra accesos no autorizados o mal uso.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies y Tecnologías Similares</h2>
      <p className="mb-4">
        Utilizamos cookies para mejorar su experiencia de navegación. Usted puede
        deshabilitarlas desde la configuración de su navegador.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Cambios al Aviso</h2>
      <p className="mb-4">
        Este Aviso de Privacidad puede actualizarse en cualquier momento. Le
        notificaremos a través de la aplicación o el sitio web cuando se realicen
        cambios significativos.
      </p>
    </div>
  );
};

export default PrivacyPolicy;