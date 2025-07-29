import React, { useState, useMemo, useRef, useEffect } from 'react';

interface CountryData {
  name: string;
  continent: string;
}

interface ContinentCountrySelectorProps {
  selectedContinents: string[];
  onContinentChange: (continents: string[]) => void;
  selectedCountries: string[];
  onCountryChange: (countries: string[]) => void;
  countriesData: CountryData[];
}

export default function ContinentCountrySelector({
  selectedContinents,
  onContinentChange,
  selectedCountries,
  onCountryChange,
  countriesData = [],
}: ContinentCountrySelectorProps) {
  const [isContinentDropdownOpen, setContinentDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  const continentRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  const { CONTINENTS, ALL_COUNTRIES } = useMemo(() => {
    if (!countriesData || countriesData.length === 0) {
      return { CONTINENTS: [], ALL_COUNTRIES: [] };
    }
    const continents = [...new Set(countriesData.map(c => c.continent))].sort();
    const allCountries = countriesData.map(c => c.name).sort();
    return { CONTINENTS: continents, ALL_COUNTRIES: allCountries };
  }, [countriesData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (continentRef.current && !continentRef.current.contains(event.target as Node)) {
        setContinentDropdownOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContinentToggle = (continent: string) => {
    const newSelection = selectedContinents.includes(continent)
      ? selectedContinents.filter(c => c !== continent)
      : [...selectedContinents, continent];
    onContinentChange(newSelection);
  };

  const handleCountryToggle = (country: string) => {
    const newSelection = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    onCountryChange(newSelection);
  };

  const filteredCountries = useMemo(() => {
    return ALL_COUNTRIES.filter(country =>
      country.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  return (
    <div className="flex gap-6">
      {/* 타겟 대륙 */}
      <div className="flex-1 space-y-2" ref={continentRef}>
        <label className="block text-sm font-medium text-gray-700">타겟 대륙</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setContinentDropdownOpen(prev => !prev)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left flex items-center justify-between focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          >
            <span className={selectedContinents.length > 0 ? 'text-gray-900' : 'text-gray-400'}>
              {selectedContinents.length > 0 ? `${selectedContinents.length}개 대륙 선택됨` : '대륙 추가...'}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isContinentDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="max-h-60 overflow-y-auto p-2">
                {CONTINENTS.map(continent => (
                  <li key={continent}>
                    <label className="flex items-center space-x-2 w-full px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedContinents.includes(continent)}
                        onChange={() => handleContinentToggle(continent)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{continent}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 타겟 국가 */}
      <div className="flex-1 space-y-2" ref={countryRef}>
        <label className="block text-sm font-medium text-gray-700">타겟 국가</label>
        <div className="relative">
          <div className="flex">
            <input
              type="text"
              placeholder="국가 검색..."
              value={countrySearch}
              onChange={e => {
                setCountrySearch(e.target.value);
                if (!isCountryDropdownOpen) {
                  setCountryDropdownOpen(true);
                }
              }}
              onFocus={() => setCountryDropdownOpen(true)}
              className="w-full border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent z-0"
            />
            <button
              type="button"
              onClick={() => setCountryDropdownOpen(prev => !prev)}
              className="px-3 border border-gray-300 bg-gray-50 rounded-r-md flex items-center justify-center hover:bg-gray-100"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          {isCountryDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-2 border-b">
                <span className="text-xs text-gray-600">{selectedCountries.length}개 국가 선택됨</span>
              </div>
              <ul className="max-h-60 overflow-y-auto p-2">
                {filteredCountries.map(country => (
                  <li key={country}>
                    <label className="flex items-center space-x-2 w-full px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{country}</span>
                    </label>
                  </li>
                ))}
                 {filteredCountries.length === 0 && (
                  <li className="px-3 py-2 text-center text-sm text-gray-500">
                    검색 결과가 없습니다.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 