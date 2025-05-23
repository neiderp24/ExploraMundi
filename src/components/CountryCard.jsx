import './styles/CountryCard.css';

export default function CountryCard({ country, onClick }) {
    const name = country.translations?.spa?.common || country.name.common;
    const capital = country.capital?.[0] || "Desconocida";

    return (
        <div
            className={`col-12 col-md-6 ${!country.unMember ? "non-recognized-country" : ""}`}
        >
            <div className="card bg-info bg-opacity-25 text-center h-100" onClick={onClick}>
                <div className="card-body bg-custom">
                    <img src={country.flags.png} alt={`Bandera de ${name}`} className="card-img-top" />
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">
                        <strong>Capital:</strong> {capital}
                    </p>
                    <p className="card-text">
                        <strong>Población:</strong> {country.population.toLocaleString()}
                    </p>
                    {!country.unMember && (
                        <p className="text-danger">
                            <strong>No es un país oficialmente reconocido</strong>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}