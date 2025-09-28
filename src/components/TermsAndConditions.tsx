
import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-justify">
      <h1 className="text-3xl font-bold mb-4">Términos y Condiciones</h1>
      <p className="mb-4">
        Bienvenido a <strong>LitFinance</strong>. Al registrarse y utilizar nuestra
        aplicación, usted acepta los presentes Términos y Condiciones. Le
        recomendamos leerlos detenidamente antes de utilizar nuestros servicios.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Objeto</h2>
      <p className="mb-4">
        LitFinance es una aplicación que permite la gestión de cuentas, subcuentas,
        transacciones, pagos recurrentes y notificaciones. La aplicación no es un
        banco ni institución financiera, sino una herramienta tecnológica para
        organizar y administrar finanzas personales.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Registro y Responsabilidad del Usuario</h2>
      <p className="mb-4">
        El usuario es responsable de proporcionar información veraz y mantener la
        confidencialidad de sus credenciales. Cualquier actividad realizada desde
        su cuenta será considerada de su responsabilidad.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Uso Permitido</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>No utilizar la aplicación para fines ilícitos.</li>
        <li>No manipular o alterar el funcionamiento de la plataforma.</li>
        <li>No compartir acceso con terceros sin autorización.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Limitación de Responsabilidad</h2>
      <p className="mb-4">
        LitFinance no se hace responsable por pérdidas económicas, mal uso de la
        aplicación, interrupciones del servicio o daños ocasionados por terceros.
        El usuario reconoce que los resultados financieros son responsabilidad de
        su propia gestión.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Propiedad Intelectual</h2>
      <p className="mb-4">
        Todo el contenido, logotipos, código y diseño de la aplicación son
        propiedad exclusiva de LitFinance. Queda prohibida su reproducción sin
        autorización.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Modificaciones</h2>
      <p className="mb-4">
        Nos reservamos el derecho de modificar estos términos en cualquier momento.
        Los cambios entrarán en vigor al ser publicados en la aplicación o el sitio
        web.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Legislación Aplicable</h2>
      <p className="mb-4">
        Estos Términos y Condiciones se rigen por las leyes mexicanas. En caso de
        disputa, se someterán a los tribunales competentes de la Ciudad de México.
      </p>
    </div>
  );
};

export default TermsAndConditions;