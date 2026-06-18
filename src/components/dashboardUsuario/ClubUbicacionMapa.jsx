import './ClubUbicacionMapa.css';

const DIRECCION_INVALIDA = /^(sin direcci[oó]n|no disponible)$/i;

const esDireccionValida = (valor) =>
  Boolean(valor && typeof valor === 'string' && !DIRECCION_INVALIDA.test(valor.trim()));

export const construirUbicacionCompleta = ({
  club = '',
  direccion = '',
  ciudad = '',
  provincia = '',
} = {}) => {
  const partes = [club, direccion, ciudad, provincia].filter(esDireccionValida);
  return partes.join(', ');
};

const obtenerUrlMapaEmbebido = (consulta) => {
  const query = encodeURIComponent(consulta);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`;
  }

  return `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
};

const obtenerUrlMapaExterno = (consulta) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;

function ClubUbicacionMapa({
  club = '',
  direccion = '',
  ciudad = '',
  provincia = '',
  titulo = 'Ubicación del club',
  className = '',
}) {
  const ubicacionCompleta = construirUbicacionCompleta({
    club,
    direccion,
    ciudad,
    provincia,
  });

  if (!ubicacionCompleta) {
    return (
      <div className={`club-mapa club-mapa--empty ${className}`.trim()}>
        <p>No hay dirección disponible para mostrar el mapa.</p>
      </div>
    );
  }

  return (
    <div className={`club-mapa ${className}`.trim()}>
      <div className="club-mapa__header">
        <span className="club-mapa__titulo">{titulo}</span>
        <a
          href={obtenerUrlMapaExterno(ubicacionCompleta)}
          target="_blank"
          rel="noopener noreferrer"
          className="club-mapa__link"
        >
          Abrir en Google Maps
          <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
        </a>
      </div>

      <div className="club-mapa__frame-wrap">
        <iframe
          title={`Mapa de ${club || 'club'}`}
          src={obtenerUrlMapaEmbebido(ubicacionCompleta)}
          className="club-mapa__frame"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <p className="club-mapa__direccion">
        <i className="bi bi-geo-alt-fill" aria-hidden="true" />
        {ubicacionCompleta}
      </p>
    </div>
  );
}

export default ClubUbicacionMapa;
