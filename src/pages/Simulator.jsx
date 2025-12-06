import React, { useState, useEffect, useMemo } from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { getProducts } from "../firebase/products.service";
import "../styles/simulador.css";

function Simulador() {
  const [tipoCredito, setTipoCredito] = useState("");
  const [monto, setMonto] = useState("");
  const [meses, setMeses] = useState("");
  const [resultado, setResultado] = useState(null);
  const [creditos, setCreditos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar créditos desde Firebase
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const data = await getProducts();
        setCreditos(data);
      } catch (error) {
        console.error("Error al cargar créditos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCredits();
  }, []);

  // Lista de tipos de crédito (para el select)
  const tiposDisponibles = useMemo(
    () => Array.from(new Set(creditos.map((c) => c.nombre))),
    [creditos]
  );

  const calcularCuota = (e) => {
    e.preventDefault();

    if (!tipoCredito || !monto || !meses) {
      alert("Por favor completa todos los campos");
      return;
    }

    const credito = creditos.find((c) => c.nombre === tipoCredito);

    if (!credito) {
      alert("Crédito no encontrado.");
      return;
    }

    // TASA ANUAL → TASA MENSUAL
    const tasaAnual = credito.tasa / 100;
    const tasaMensual = tasaAnual / 12;

    const P = Number(monto);
    const n = Number(meses);
    const i = tasaMensual;

    const cuota = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const totalPagar = cuota * n;
    const interesesTotales = totalPagar - P;

    setResultado({
      cuota: cuota.toFixed(2),
      totalPagar: totalPagar.toFixed(2),
      interesesTotales: interesesTotales.toFixed(2),
      tasa: credito.tasa, // anual
    });
  };

  if (loading) return <p>Cargando créditos...</p>;

  return (
    <div>
      <Hero
        titulo="Simulador de Créditos"
        parrafos={[
          "Simula tu crédito y descubre cuánto pagarías al mes.",
          "Selecciona un tipo de crédito, el monto y el plazo.",
        ]}
      />

      {/* FORM */}
      <section className="simulador-section">
        <h2>Simular crédito</h2>

        <form onSubmit={calcularCuota}>
          <div className="simulacion-grid">
            <div className="input-group">
              <label>Tipo de crédito</label>
              <select
                value={tipoCredito}
                onChange={(e) => setTipoCredito(e.target.value)}
              >
                <option value="">Seleccione</option>
                {tiposDisponibles.map((t, i) => (
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Monto solicitado</label>
              <input
                type="number"
                min="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="Ej: 50000000"
              />
            </div>

            <div className="input-group">
              <label>Plazo (meses)</label>
              <input
                type="number"
                min="1"
                value={meses}
                onChange={(e) => setMeses(e.target.value)}
                placeholder="Ej: 12"
              />
            </div>
          </div>

          <button className="btn-calcular" type="submit">
            Calcular
          </button>
        </form>
      </section>

      {/* RESULTADO */}
      {resultado && (
        <div className="resultado-box">
          <h3>Resultado de la simulación</h3>

          <p><strong>Tasa anual:</strong> {resultado.tasa}%</p>
          <p><strong>Cuota mensual:</strong> ${Number(resultado.cuota).toLocaleString()}</p>
          <p><strong>Total a pagar:</strong> ${Number(resultado.totalPagar).toLocaleString()}</p>
          <p><strong>Intereses totales:</strong> ${Number(resultado.interesesTotales).toLocaleString()}</p>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Simulador;
