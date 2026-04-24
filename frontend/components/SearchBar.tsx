'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="بحث..."
          className="w-48 md:w-64 px-4 py-2 border rounded-r-lg focus:outline-none focus:border-primary"
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-l-lg hover:bg-primary/90"
        >
          🔍
        </button>
      </form>
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50">
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