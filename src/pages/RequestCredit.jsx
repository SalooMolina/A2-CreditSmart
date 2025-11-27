//Importaciones
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import "../styles/solicitar.css";

// Estados del formulario de solicitud de crédito
// Cada useState guarda un dato o control del formulario
const RequestCredit = () => {
  const [nombre, setNombre] = useState(""); //Para que cambie de estar vacio a lleno (onChange)
  const [cedula, setCedula] = useState("");
  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoCredito, setTipoCredito] = useState("");

  // Estados auxiliares
  const [errors, setErrors] = useState({}); // Errores de validación
  const [cuota, setCuota] = useState(null); // Cálculo de la cuota
  const [resumenVisible, setResumenVisible] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]); // Historial de solicitudes
  const [success, setSuccess] = useState(false); // Indica si la solicitud fue exitosa

  // VALIDACIONES EN TIEMPO REAL
  const validate = (field, value) => { //Recibe 2 cosas, el nombre y el valor de ese campo
    let newErrors = { ...errors }; //Crea una copia independiente, agrega o quita errores sin modificar el original

    if (field === "nombre" && value.trim().length < 3) { //Si el nombre tiene menos de 3 carácteres
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else {
      delete newErrors.nombre; //Si no, lo elimina (si el valor es válido)
    }

    if (field === "cedula" && !/^\d{6,10}$/.test(value)) {
      newErrors.cedula = "La cédula debe ser numérica y entre 6 y 10 dígitos.";
    } else {
      delete newErrors.cedula;
    }

    if (field === "correo" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.correo = "Correo no válido.";
    } else {
      delete newErrors.correo;
    }

    if (field === "telefono" && !/^\d{10}$/.test(value)) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos.";
    } else {
      delete newErrors.telefono;
    }
 
    setErrors(newErrors); // Actualiza el estado 'errors' con el objeto 'newErrors'.
                          // Esto hace que React muestre en pantalla los mensajes de error actuales
                          // o los elimine si el campo ya es válido.
  };

  // CÁLCULO CUOTA
  const calcularCuota = (monto, plazo) => {
    if (!monto || !plazo) return null; //Si falta alguno de los 2 valores no calcula nada

    const tasaMensual = 0.015;
    const p = parseFloat(monto); //Se aseura que los valores sean números
    const n = parseInt(plazo); // ...

    //Formula para calcular los pagos
    //(monto * tasaMensual) / (1 - (1+tasaMensual)^-plazo)
    const cuotaCalc =
      (p * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -n));

    return cuotaCalc.toFixed(2); //Redondea el resultado a 2 decimales
  };

  const handleMontoPlazoChange = (field, value) => { // field indica que campo cambió, value es el nuevo valor que se ingresó
    if (field === "monto") setMonto(value); //si se cambio monto, se actualiza
    if (field === "plazo") setPlazo(value); //Si se cambió plazo, se actualiza (con setPLazo)

    // Se asegura que se use el valor más reciente
    // Ejm: Si el campo que cambió fue el monto, usa value como updatedMonto.
    // Si no, usa el monto que ya estaba guardado.
    const updatedMonto = field === "monto" ? value : monto;
    const updatedPlazo = field === "plazo" ? value : plazo;

    setCuota(calcularCuota(updatedMonto, updatedPlazo)); //Llama la función, guarda el resultado en el estado cuota
  };

  // ENVIAR SOLICITUD
  const enviarSolicitud = () => {
    const nuevaSolicitud = { //Agrupa todos los valores actuales del formulario en un solo objeto
      nombre,
      cedula,
      correo,
      telefono,
      monto,
      plazo,
      cuota,
      tipoCredito 
    };

    //MEMORIA TEMPORAL.
    setSolicitudes([...solicitudes, nuevaSolicitud]); //// Agrega la nueva solicitud al arreglo de solicitudes,

    setSuccess(true); //Activa un estado de éxito (ej. un mensaje de “Solicitud enviada”).
    setResumenVisible(false);

    // limpiar
    // Resetea todos los estados para que los inputs queden vacíos.
    setNombre("");
    setCedula("");
    setCorreo("");
    setTelefono("");
    setMonto("");
    setPlazo("");
    setCuota(null);
    setTipoCredito(""); 

    setTimeout(() => setSuccess(false), 3000); //Usa setTimeout para volver a poner success en false después de 3000 ms (3 segundos).
  };

  return (
    <>

      {/* HERO */}
      <Hero 
        titulo="Solicitar Crédito"
        parrafos={["Completa el formulario con tu información y el tipo de crédito que deseas.",
          "Con estos datos podremos evaluar tu perfil, orientarte de la mejor manera y brindarte una oferta justa, transparente y hecha a tu medida."
        ]}
      />

      <div className="solicitar-container">

        <h2 className="titulo-formulario">Formulario de Solicitud</h2>

        <form className="formulario">

          {/* NOMBRE */}
          <div className="grupo">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={nombre} // Input controlado: el valor del campo siempre refleja el estado,
                            // y al escribir se actualiza el estado.
              onChange={(e) => { //Cada vez que el usuario escribe algo
                setNombre(e.target.value); //guarda el nuevo valor en el estado nombre.
                validate("nombre", e.target.value); //valida en tiempo real ese valor.
              }}
            />
            {errors.nombre && <span className="error">{errors.nombre}</span>} {/*Renderiza un mensaje de error solo si existe errors.nombre. */}
          </div>

          {/* CÉDULA */}
          <div className="grupo">
            <label>Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => {
                setCedula(e.target.value);
                validate("cedula", e.target.value);
              }}
            />
            {errors.cedula && <span className="error">{errors.cedula}</span>}
          </div>

          {/* CORREO */}
          <div className="grupo">
            <label>Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                validate("correo", e.target.value);
              }}
            />
            {errors.correo && <span className="error">{errors.correo}</span>}
          </div>

          {/* TELEFONO */}
          <div className="grupo">
            <label>Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                validate("telefono", e.target.value);
              }}
            />
            {errors.telefono && <span className="error">{errors.telefono}</span>}
          </div>

          {/* SELECT TIPO DE CRÉDITO */}
          <div className="grupo">
            <label>Tipo de Crédito</label>
            <select
              value={tipoCredito}
              onChange={(e) => setTipoCredito(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              <option value="Libre Inversión">Libre Inversión</option>
              <option value="Vehículo">Crédito vehicular</option>
              <option value="Vivienda">Crédito vivienda</option>
              <option value="Educativo">Crédito educativo</option>
              <option value="Agropecuario">Crédito agropecuario</option>
              <option value="Empresarial">Crédito empresarial</option>
            </select>
          </div>

          {/* MONTO */}
          <div className="grupo">
            <label>Monto solicitado</label>
            <input
              type="number"
              min="500000"
              value={monto}
              onChange={(e) => handleMontoPlazoChange("monto", e.target.value)}
            />
          </div>

          {/* PLAZO */}
          <div className="grupo">
            <label>Plazo (meses)</label>
            <select
              value={plazo}
              onChange={(e) => handleMontoPlazoChange("plazo", e.target.value)}
            >
              <option value="">Seleccione</option>
              <option value="6">6 meses</option>
              <option value="12">12 meses</option>
              <option value="18">18 meses</option>
              <option value="24">24 meses</option>
            </select>
          </div>

          {/* CUOTA */}
          {/*muestra la cuota mensual solo si existe un valor calculado. */}
          {cuota && (
            <p className="cuota">
              Cuota mensual estimada: <strong>${cuota}</strong>
            </p>
          )}

          {/* BOTÓN RESUMEN */}
          <button
            className="btn-morado"
            type="button"
            onClick={() => setResumenVisible(true)} //Cuando el usuario hace clic, cambia el estado resumenVisible a true.
            disabled={Object.keys(errors).length > 0 || !nombre || !cedula} //Solo se habilita si no hay errores y nombre y cédula están completos.
          >
            Ver Resumen
          </button>
        </form>

        {/* RESUMEN */}
        {resumenVisible && ( //solo aparece si el estado resumenVisible es true.
          <div className="resumen">
            <h3>Resumen de la solicitud</h3>
            {/*Cada <p> imprime un campo del formulario */}
            {/*indica que el texto dentro tiene énfasis fuerte o importancia especial. */}
            <p><strong>Nombre:</strong> {nombre}</p>
            <p><strong>Cédula:</strong> {cedula}</p>
            <p><strong>Correo:</strong> {correo}</p>
            <p><strong>Teléfono:</strong> {telefono}</p>

            {/* *** NUEVO *** */}
            <p><strong>Tipo de crédito:</strong> {tipoCredito}</p>

            <p><strong>Monto:</strong> ${monto}</p>
            <p><strong>Plazo:</strong> {plazo} meses</p>
            <p><strong>Cuota mensual:</strong> ${cuota}</p>

          {/*Al hacer clic, ejecuta la función enviarSolicitud, que guarda la solicitud y limpia el formulario. */}
            <button className="btn-rosa" onClick={enviarSolicitud}>
              Enviar Solicitud
            </button>
          </div>
        )}

        {/* ÉXITO */}
        {success && (//el bloque <div> solo aparece si el estado success es true.
          <div className="exito"> 
            ¡Solicitud enviada con éxito! 🎉
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default RequestCredit;
