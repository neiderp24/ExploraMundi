export default function SortSelector({ sortOrder, setSortOrder }) {
    return (
        <div className="mb-3">
            <label htmlFor="sortSelect" className="form-label">Ordenar por población:</label>
            <select
                id="sortSelect"
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="default">Sin ordenar</option>
                <option value="desc">Mas poblados</option>
                <option value="asc">Menos poblados</option>
            </select>
        </div>
    );
}
