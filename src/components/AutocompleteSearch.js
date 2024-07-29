import { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle , Mic } from 'lucide-react';

export default function AutocompleteSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:3001/api/search?query=${query}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setError('Failed to fetch suggestions. Please try again.');
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (id) => {
    onSelect(id);
    setQuery('');
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[focusedIndex].id);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
    <div className="relative">
      <div className="flex items-center w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg focus-within:shadow-lg">
        <Search className="ml-4 text-gray-500" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a book..."
          className="w-full py-3 px-4 text-gray-700 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 8.586L6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 101.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 00-1.414-1.414L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        {/* <Mic className="mr-4 text-blue-500 cursor-pointer" size={20} /> */}
      </div>
    </div>
    {isLoading && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
      </div>
    )}
    {error && (
      <div className="mt-2 text-red-500 flex items-center">
        <span>{error}</span>
      </div>
    )}
    {suggestions.length > 0 && (
      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 ${
              index === focusedIndex ? 'bg-gray-100' : ''
            }`}
            onClick={() => handleSelect(suggestion.id)}
            onMouseEnter={() => setFocusedIndex(index)}
          >
            <div className="flex items-center">
              <Search className="mr-3 text-gray-400" size={16} />
              {suggestion.title}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
}