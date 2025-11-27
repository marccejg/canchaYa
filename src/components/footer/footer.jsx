import "./footer.css"; 

export default function Footer() {
    return (
    <footer className="footer-container">

      {/* COLUMNA 1 - SEGUINOS */}
    <div className="footer-section">
        <h3>Seguinos</h3>
        <ul>
        <li><a href="MANDAR A SECCION DEPORTES"
            className="footer-link">
            Reserva tu cancha en tres clicks</a></li>
        <li>
            <a 
            href="https://www.instagram.com/canchasyaa/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
            >
            <i className="bi bi-instagram"></i>
            </a>
        </li>
        <li>@2025. Todos los derechos reservados</li>
        </ul>
    </div>

      {/* COLUMNA 2 - CONTACTANOS */}
    <div className="footer-section">
        <h3>Contactanos</h3>
        <ul>
        <li>Email: canchasYaa@gmail.com</li>
        <li>Tel: +54 2983340901</li>
        <li>HQ: Tres Arroyos, Buenos Aires, Argentina</li>
        </ul>
    </div>

      {/* COLUMNA 3 - LEGAL */}
    <div className="footer-section">
        <h3>Legal</h3>
        <ul>
        <li>     <a
        href="https://www.linkejemplo.com"
        className="header-derecha-link"
        target="_blank"
        rel="noopener noreferrer"
        >
    Terminos y condiciones
        </a></li>
        <li> <a
        href="https://www.linkejemplo.com"
        className="header-derecha-link"
        target="_blank"
        rel="noopener noreferrer"
        >
        Política de Privacidad
        </a></li>
        </ul>
    </div>

    </footer>
    );
}
