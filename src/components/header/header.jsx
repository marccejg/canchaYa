import "./header.css";
import logo from "./logo_blanco_720.png";

export default function Header({ currentUser }) {
    return (
    <header className="header-container">

    {/*logo d la izquierda*/}
    <div className="header-izquierda">
        <img src={logo} alt="logo" className="header-logo" />
    </div> 

    {/*logos del centro*/}
    <div className="header-centro">
        {/*Mail*/}
        <a href="mailto:lzuugl@gmail.com" 
        className="header-centro-link">
            <i className="bi bi-envelope"></i>
        </a>
        {/*Instagram*/}
        <a
        href="https://www.instagram.com/canchasyaa/"
        target="_blank"
        rel="noopener noreferrer"
        className="header-centro-link"
        >
        <i className="bi bi-instagram"></i>
        </a>
                {/*Facebook*/}
        <a
        href="https://www.instagram.com/canchasyaa/"
        target="_blank"
        rel="noopener noreferrer"
        className="header-centro-link"
        >
        <i className="bi bi-facebook"></i>
        </a>
    </div>

    {/*parte derecha(muestra email de usuario logueado o registrate)*/}
    <div className="header-derecha">
        {currentUser ? (
            <div className="header-derecha-link">
                <i className="bi bi-person"></i>
                <span className="header-texto-derecha">{currentUser.email || currentUser.usuario}</span>
            </div>
        ) : (
            <a
            href="Mandar a seccion registro"
            className="header-derecha-link"
            target="_blank"
            rel="noopener noreferrer"
            >
            <i className="bi bi-person"></i>
            <span className="header-texto-derecha">Regístrate acá</span>
            </a>
        )}
    </div>

    </header>
);
}