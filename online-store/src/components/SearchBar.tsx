import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    onSearchSubmit: () => void;
}

export const SearchBar = ({ searchTerm, onSearch, onSearchSubmit }: SearchBarProps) => {
    const [query, setQuery] = useState(searchTerm);
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearchSubmit();
    };

    // Auto-collapse search on mobile when query is empty
    useEffect(() => {
        if (!query && window.innerWidth < 768) {
            setIsExpanded(false);
        }
    }, [query]);

    return (
        <form
            className={`search-bar ${isExpanded ? 'expanded' : ''}`}
            onSubmit={handleSearch}
        >
            {isExpanded && (
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onSearch(e.target.value);
                    }}
                    autoFocus
                    className="search-input"
                />
            )}

            <button
                type={isExpanded ? 'submit' : 'button'}
                className="search-button"
                onClick={() => !isExpanded && setIsExpanded(true)}
                aria-label={isExpanded ? 'Submit search' : 'Open search'}
            >
                🔍
            </button>
        </form>
    );
};