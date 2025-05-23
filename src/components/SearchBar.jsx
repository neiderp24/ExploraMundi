import React from "react";

const SearchBar = ({ searchTerm, onSearch }) => {
    return (
        <div style={{ display: "none" }}> {/* Oculta el componente visualmente */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar país..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;