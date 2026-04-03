import React from "react";

const AcceptableUsePolicy: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-justify">
      <h1 className="text-3xl font-bold mb-4">Política de Uso Aceptable</h1>
      <p className="mb-4"><strong>Última actualización:</strong> [FECHA]</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Uso permitido</h2>
        <p className="mb-4">LitFinance podrá utilizarse únicamente para registrar, organizar, visualizar y analizar información financiera personal o interna legítimamente capturada por la persona usuaria, conforme a la funcionalidad ofrecida por la aplicación.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Conductas prohibidas</h2>
        <p className="mb-4">Queda estrictamente prohibido:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Utilizar LitFinance para actividades ilícitas, fraudulentas o engañosas.</li>
          <li>Proporcionar información falsa, inexacta o suplantar identidades.</li>
          <li>Acceder o intentar acceder sin autorización a cuentas, sistemas o datos de terceros.</li>
          <li>Compartir contraseñas, tokens o credenciales con terceros no autorizados.</li>
          <li>Introducir malware, scripts o automatizaciones abusivas.</li>
          <li>Realizar ingeniería inversa, descompilar o modificar el software sin permiso.</li>
          <li>Efecutar scraping masivo o consultas automatizadas no autorizadas.</li>
          <li>Manipular reportes o historiales con fines engañosos o fraudulentos.</li>
          <li>Ingresar datos personales de terceros sin autorización legal.</li>
          <li>Publicar contenido difamatorio, discriminatorio o ilícito.</li>
          <li>Infringir derechos de propiedad intelectual.</li>
          <li>Evadir controles de acceso o medidas antifraude.</li>
          <li>Revender o sublicenciar la aplicación sin autorización.</li>
          <li>Abusar de soporte o crear cuentas múltiples para evadir sanciones.</li>
          <li>Presentar LitFinance como institución financiera o custodio de dinero.</li>
          <li>Cargar archivos peligrosos o ejecutables que comprometan la seguridad.</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Medidas por incumplimiento</h2>
        <p className="mb-4">Ante incumplimientos reales o sospechados, LitFinance podrá adoptar medidas como monitoreo reforzado, requerimiento de información, limitación de funciones, suspensión temporal, cancelación de cuenta, eliminación o bloqueo de contenido, preservación de evidencia y notificación a autoridades competentes.</p>
      </section>

      <section className="mt-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Reportes y conservación de evidencia</h2>
        <p className="mb-4">Reportes a: [CORREO LEGAL] o [CORREO PRIVACIDAD / ARCO]. LitFinance podrá conservar bitácoras y evidencias necesarias para investigar incidentes.</p>
      </section>
    </div>
  );
};

export default AcceptableUsePolicy;
