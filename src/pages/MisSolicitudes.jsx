import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { updateRequest, deleteRequest } from "../firebase/requests.service";
import "../styles/misSolicitudes.css";

function MisSolicitudes() {
  const [email, setEmail] = useState(localStorage.getItem("correoUsuario") || "");
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // ---- Editar ----
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ---- Eliminar ----
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchSolicitudes = async () => {
    if (!email.trim()) {
      setSolicitudes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, "solicitudes"),
        where("correo", "==", email),
        orderBy("fecha", "desc")
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSolicitudes(data);
    } catch (err) {
      setError("Error al cargar solicitudes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchSolicitudes();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // ---- EDITAR ----
  const openEditModal = (sol) => {
    setEditData({ ...sol });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    await updateRequest(editData.id, editData);
    setShowEditModal(false);
    fetchSolicitudes();
  };

  // ---- ELIMINAR ----
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const deleteSolicitud = async () => {
    await deleteRequest(deleteId);
    setShowDeleteModal(false);
    fetchSolicitudes();
  };

  return (
    <>
      <Hero
        titulo="Mis Solicitudes"
        parrafos={[
          "Consulta, edita o elimina tus solicitudes guardadas.",
          "Busca por correo para ver tu historial."
        ]}
      />

      <div className="mis-solicitudes-container">

        {/* FILTRO */}
        <div className="filtro-correo">
          <input
            type="email"
            placeholder="Ingresa tu correo para buscar"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn-buscar" onClick={fetchSolicitudes}>
            Buscar
          </button>
        </div>

        {loading && <p className="mensaje-cargando">Cargando solicitudes...</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {!loading && solicitudes.length === 0 && (
          <p className="mensaje-vacio">No se encontraron solicitudes.</p>
        )}

        <ul className="lista-solicitudes">
          {solicitudes.map(s => (
            <li key={s.id} className="item-solicitud">
              <strong>{s.tipoCredito}</strong>
              <span>Monto: ${s.monto}</span>
              <span>Plazo: {s.plazo} meses</span>
              <p className="fecha-solicitud">
                Fecha: {new Date(s.fecha).toLocaleDateString()}
              </p>

              <button className="btn-ver-mas" onClick={() => toggleExpand(s.id)}>
                {expandedId === s.id ? "Ver menos ▲" : "Ver más ▼"}
              </button>

              {expandedId === s.id && (
                <div className="detalle-solicitud">
                  <p><strong>Nombre:</strong> {s.nombre}</p>
                  <p><strong>Cédula:</strong> {s.cedula}</p>
                  <p><strong>Email:</strong> {s.correo}</p>
                  <p><strong>Teléfono:</strong> {s.telefono}</p>
                  <p><strong>Destino:</strong> {s.destino}</p>
                  <p><strong>Empresa:</strong> {s.empresa}</p>
                  <p><strong>Cargo:</strong> {s.cargo}</p>
                  <p><strong>Ingresos:</strong> ${s.ingresos}</p>
                  <p><strong>Cuota mensual estimada:</strong> ${s.cuota}</p>

                  <div className="acciones">
                    <button className="btn-editar" onClick={() => openEditModal(s)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => confirmDelete(s.id)}>Eliminar</button>
                  </div>
                </div>
              )}

            </li>
          ))}
        </ul>

        <div className="botones-navegacion">
          <Link to="/" className="btn-morado">Volver al Inicio</Link>
          <Link to="/request" className="btn-rosa">Nueva Solicitud</Link>
        </div>
      </div>

      {/* ===== MODAL EDITAR ===== */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Editar Solicitud</h3>

            <form
              className="form-modal"
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit();
              }}
            >

              <div className="grupo">
                <label>Nombre</label>
                <input
                  value={editData.nombre}
                  onChange={(e) => handleEditChange("nombre", e.target.value)}
                />
              </div>

              <div className="grupo">
                <label>Cédula</label>
                <input
                  value={editData.cedula}
                  onChange={(e) => handleEditChange("cedula", e.target.value)}
                />
              </div>

              <div className="grupo">
                <label>Email</label>
                <input
                  value={editData.correo}
                  onChange={(e) => handleEditChange("correo", e.target.value)}
                />
              </div>

              <div className="grupo">
                <label>Teléfono</label>
                <input
                  value={editData.telefono}
                  onChange={(e) => handleEditChange("telefono", e.target.value)}
                />
              </div>

              <div className="grupo">
                <label>Destino</label>
                <input
                  value={editData.destino}
                  onChange={(e) => handleEditChange("destino", e.target.value)}
                />
              </div>

              <div className="grupo">
                <label>Empresa</label>
                <input
                  value={editData.empresa}
                  onChange={(e) => handleEditChange("empresa", e.target.value)}
                />
              </div>

              <div className="grupo">
                <label>Cargo</label>
                <input
                  value={editData.cargo}
                  onChange={(e) => handleEditChange("cargo", e.target.value)}
                />
              </div>

              <div className="grupo">
                <label>Ingresos</label>
                <input
                  value={editData.ingresos}
                  onChange={(e) => handleEditChange("ingresos", e.target.value)}
                />
              </div>

              <div className="acciones">
                <button
                  type="button"
                  className="btn-morado"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-editar">
                  Guardar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL ELIMINAR ===== */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>¿Deseas eliminar esta solicitud?</h3>

            <div className="acciones">
              <button className="btn-eliminar" onClick={deleteSolicitud}>Sí, eliminar</button>
              <button className="btn-morado" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default MisSolicitudes;
