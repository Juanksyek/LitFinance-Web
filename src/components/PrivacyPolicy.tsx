
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-justify">
      <h1 className="text-3xl font-bold mb-4">Aviso de Privacidad Integral</h1>
      <p className="mb-4"><strong>Última actualización:</strong> 01/04/2024</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">I. Identidad y domicilio del responsable</h2>
        <p className="mb-4">Juan Carlos Flores Ramírez (persona física), con nombre comercial LitFinance, con domicilio para oír y recibir notificaciones en [DOMICILIO PROTEGIDO POR PRIVACIDAD]. Para asuntos de privacidad: [CORREO PROTEGIDO POR PRIVACIDAD]. Soporte/legal: [CORREO PROTEGIDO POR PRIVACIDAD LEGAL].</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">II. Datos personales que podemos tratar</h2>
        <p className="mb-4">Dependiendo del uso, podremos tratar:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Datos de identificación y contacto (nombre, correo, teléfono, alias).</li>
          <li>Datos de cuenta y autenticación (credenciales, tokens).</li>
          <li>Datos patrimoniales y financieros capturados voluntariamente (gastos, ingresos, presupuestos, movimientos, recurrencias).</li>
          <li>Datos técnicos y de uso (IP, navegador, logs, cookies, SDKs).</li>
          <li>Permisos del dispositivo (cámara, notificaciones) cuando la persona usuaria los habilite.</li>
          <li>Datos estadísticos o de perfil compartidos voluntariamente.</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">III. Datos sensibles</h2>
        <p className="mb-4">LitFinance no busca recabar ni tratar datos personales sensibles como regla general. Le solicitamos no ingresar en campos abiertos o de uso general datos relativos a salud, origen étnico o racial, creencias religiosas, opiniones políticas, preferencia sexual u otros datos sensibles. Si, de manera excepcional, se requirieran datos sensibles, LitFinance solicitará consentimiento expreso y por escrito.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">IV. Finalidades necesarias</h2>
        <p className="mb-4">Tratamos datos para:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Crear y gestionar cuentas.</li>
          <li>Autenticar y proteger accesos.</li>
          <li>Permitir captura, edición y visualización de información financiera.</li>
          <li>Generar reportes, analítica y alertas.</li>
          <li>Prestar soporte y gestionar suscripciones.</li>
          <li>Prevenir fraude y cumplir obligaciones legales.</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">V. Finalidades secundarias</h2>
        <p className="mb-4">De manera adicional, y no necesaria para la prestación del servicio principal, LitFinance podrá tratar sus datos para:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Enviar información sobre novedades, promociones o campañas.</li>
          <li>Realizar encuestas de satisfacción o estudios estadísticos.</li>
          <li>Analizar perfiles generales para mejorar producto y experiencia.</li>
        </ul>
        <p className="mb-4">Si no desea el tratamiento para estas finalidades, envíe un correo a [CORREO PROTEGIDO POR PRIVACIDAD] con el asunto “Negativa a finalidades secundarias”.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">VI. Consentimiento</h2>
        <p className="mb-4">LitFinance tratará sus datos conforme al aviso de privacidad antes o al momento de recabarlos. Cuando el tratamiento involucre datos financieros o patrimoniales, LitFinance recabará consentimiento expreso mediante casilla, botón de aceptación u otro mecanismo equivalente.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">VII. Transferencias y encargados</h2>
        <p className="mb-4">LitFinance podrá apoyarse en proveedores tecnológicos y de infraestructura (por ejemplo Google/Firebase, AWS, Railway, Netlify, Stripe) que pueden tratar datos por cuenta de LitFinance bajo obligaciones de confidencialidad. También podrá comunicar datos a autoridades competentes cuando exista obligación legal.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">VIII. Derechos ARCO</h2>
        <p className="mb-4">Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento. Para ejercerlos envíe una solicitud a [CORREO PROTEGIDO POR PRIVACIDAD / ARCO] indicando nombre, medio de contacto, identificación, descripción clara de los datos y el derecho que desea ejercer. LitFinance responderá en un plazo máximo de 20 días hábiles.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">IX. Revocación del consentimiento</h2>
        <p className="mb-4">Puede revocar su consentimiento enviando su solicitud a [CORREO PROTEGIDO POR PRIVACIDAD / ARCO]. La revocación no tendrá efectos retroactivos y, en ciertos casos, puede impedir la prestación del servicio.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">X. Opciones para limitar el uso o divulgación</h2>
        <p className="mb-4">Puede limitar el uso mediante la configuración en la app, desactivación de notificaciones, negativa a finalidades secundarias o solicitud de baja de campañas comerciales.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">XI. Tecnologías automáticas de recolección</h2>
        <p className="mb-4">LitFinance puede utilizar cookies, SDKs, tokens y otras tecnologías para autenticación, seguridad y métricas. Puede deshabilitar algunas desde su navegador, aunque ciertas funciones podrían dejar de operar.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">XII. Medidas de seguridad</h2>
        <p className="mb-4">LitFinance adopta medidas administrativas, técnicas y físicas razonables (cifrado en tránsito, control de acceso, bitácoras, respaldos, acuerdos de confidencialidad, etc.) según la sensibilidad de los datos.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">XIII. Vulneraciones de seguridad</h2>
        <p className="mb-4">En caso de vulneración significativa, LitFinance informará la naturaleza del incidente, datos comprometidos, acciones correctivas y recomendaciones para proteger sus intereses.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">XIV. Conservación de datos</h2>
        <p className="mb-4">LitFinance conservará sus datos solo el tiempo necesario para las finalidades, relación jurídica, atención de solicitudes y cumplimiento legal. Como criterio general: datos de cuenta se conservan mientras la cuenta esté activa; evidencias contractuales hasta 10 años; respaldos y bitácoras por periodos internos razonables.</p>
      </section>

      <section className="mt-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">XV. Menores de edad</h2>
        <p className="mb-4">Si detecta datos de menores sin autorización, contacte a [CORREO PROTEGIDO POR PRIVACIDAD / ARCO] para solicitar revisión, bloqueo o eliminación.</p>
      </section>

    </div>
  );
};

export default PrivacyPolicy;