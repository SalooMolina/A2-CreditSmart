//Importaciones
import React from "react";
import Hero from "../components/Hero";
import CreditCard from "../components/CreditCard"; //Las tarjetas que muestran cada crédito
import Footer from "../components/Footer";
import creditsData from "../data/creditsData";
import "../styles/credits.css"; 

function Home() {
  //Para definir los textos que mostrará el Hero
  const heroTextos = [
    "En CreditSmart, entendemos que cada proyecto de vida es único. Por eso, hemos diseñado una completa gama de productos crediticios que se adaptan a tus sueños y necesidades financieras, desde el crecimiento personal hasta el impulso de tu negocio.",
    "Explora nuestras opciones con tasas competitivas y plazos flexibles, y comienza hoy mismo tu camino hacia el éxito con la tranquilidad y el respaldo de una decisión inteligente."
  ];

  return (
    <div>
      <Hero titulo="Nuestros Servicios" parrafos={heroTextos} /> {/Uso del componente Hero/}

      {/* Sección de productos crediticios */}
      <section className="seccion-creditos">
        <div className="credits-grid">
          {creditsData.map((credit) => ( //Está recorriendo el array de créditos y creando una Card por cada uno
            <CreditCard //Props que pasa:
              key={credit.id}
              nombre={credit.nombre}
              descripcion={credit.descripcion}
              tasa={credit.tasa}
              monto={credit.monto}
              plazo={credit.plazo}
              imagen={credit.imagen} 
            />
          ))}
        </div>
      </section>

      <Footer /> {/Cierra el footer/}
    </div>
  );
}

export default Home;
