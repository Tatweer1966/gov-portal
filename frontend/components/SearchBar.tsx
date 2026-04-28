'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Search suggestions error:', error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
    setIsOpen(true);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="بحث..."
            aria-label="بحث في المحتوى"
            className="w-48 md:w-64 px-4 py-2 border rounded-r-lg focus:outline-none focus:border-primary pr-8"
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="مسح النص"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-l-lg hover:bg-primary/90"
          aria-label="بحث"
        >
          🔍
        </button>
      </form>
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={() => {
                setQuery(suggestion);
                router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                setIsOpen(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}