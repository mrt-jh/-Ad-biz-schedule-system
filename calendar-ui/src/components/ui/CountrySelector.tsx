import React, { useState, useMemo } from 'react';

interface CountryData {
  name: string;
  continent: string;
}

interface CountrySelectorProps {
  selectedCountries: string[];
  onCountryChange: (countries: string[]) => void;
  countriesData: CountryData[];
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountries,
  onCountryChange,
  countriesData = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');

  const { CONTINENTS, ALL_COUNTRIES, CONTINENTS_AND_COUNTRIES } = useMemo(() => {
    if (!countriesData || countriesData.length === 0) {
      return { CONTINENTS: [], ALL_COUNTRIES: [], CONTINENTS_AND_COUNTRIES: {} };
    }
    const continents = [...new Set(countriesData.map(c => c.continent))].sort();
    const allCountries = countriesData.map(c => c.name).sort();
    const continentsAndCountries = countriesData.reduce((acc, country) => {
      if (!acc[country.continent]) {
        acc[country.continent] = [];
      }
      acc[country.continent].push(country.name);
      return acc;
    }, {} as Record<string, string[]>);

    return { 
      CONTINENTS: continents, 
      ALL_COUNTRIES: allCountries, 
      CONTINENTS_AND_COUNTRIES: continentsAndCountries 
    };
  }, [countriesData]);

  // 검색 필터링된 국가들
  const filteredCountries = useMemo(() => {
    if (!searchTerm && !selectedContinent) {
      return CONTINENTS_AND_COUNTRIES;
    }

    const filtered: { [key: string]: string[] } = {};

    Object.entries(CONTINENTS_AND_COUNTRIES).forEach(([continent, countries]) => {
      // 대륙 필터가 있으면 해당 대륙만
      if (selectedContinent && continent !== selectedContinent) {
        return;
      }

      // 검색어로 필터링
      const matchedCountries = Array.from(countries).filter((country: string) =>
        country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        continent.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchedCountries.length > 0) {
        filtered[continent] = matchedCountries;
      }
    });

    return filtered;
  }, [searchTerm, selectedContinent, CONTINENTS_AND_COUNTRIES]);

  // 국가 선택/해제 핸들러
  const handleCountryToggle = (country: string) => {
    const newCountries = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    onCountryChange(newCountries);
  };

  // 대륙 전체 선택/해제
  const handleContinentToggle = (continent: string) => {
    const continentCountries = CONTINENTS_AND_COUNTRIES[continent];
    if (!continentCountries) return;
    
    const countriesArray = Array.from(continentCountries);
    const allSelected = countriesArray.every((country: string) => selectedCountries.includes(country));
    
    if (allSelected) {
      // 모두 선택되어 있으면 해제
      const newCountries = selectedCountries.filter((country: string) => !countriesArray.includes(country));
      onCountryChange(newCountries);
    } else {
      // 일부 또는 없으면 모두 선택
      const newCountries = [...new Set([...selectedCountries, ...countriesArray])];
      onCountryChange(newCountries);
    }
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedCountries.length === ALL_COUNTRIES.length) {
      onCountryChange([]);
    } else {
      onCountryChange([...ALL_COUNTRIES]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">타겟 국가</label>
      
      {/* 선택된 국가 표시 */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[42px] flex items-center"
      >
        {selectedCountries.length === 0 ? (
          <span className="text-gray-500">국가 선택...</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedCountries.slice(0, 3).map(country => (
              <span key={country} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {country}
              </span>
            ))}
            {selectedCountries.length > 3 && (
              <span className="text-gray-500 text-sm">+{selectedCountries.length - 3}개</span>
            )}
          </div>
        )}
        <span className="ml-auto text-gray-400">▼</span>
      </div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* 검색 및 필터 */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="국가 또는 대륙 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="flex items-center gap-2 mt-2">
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">모든 대륙</option>
                {CONTINENTS.map(continent => (
                  <option key={continent} value={continent}>{continent}</option>
                ))}
              </select>
              
              <button
                onClick={handleSelectAll}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                {selectedCountries.length === ALL_COUNTRIES.length ? '전체 해제' : '전체 선택'}
              </button>
              
              <span className="text-xs text-gray-500 ml-auto">
                {selectedCountries.length}개 선택됨
              </span>
            </div>
          </div>

          {/* 국가 목록 */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(filteredCountries).map(([continent, countries]) => (
              <div key={continent} className="border-b border-gray-100 last:border-b-0">
                {/* 대륙 헤더 */}
                <div className="bg-gray-50 px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={countries.every(country => selectedCountries.includes(country))}
                      onChange={() => handleContinentToggle(continent)}
                      className="mr-2"
                    />
                    <span className="font-medium text-sm text-gray-700">{continent}</span>
                    <span className="ml-2 text-xs text-gray-500">({countries.length}개)</span>
                  </div>
                </div>
                
                {/* 국가 목록 */}
                <div className="max-h-32 overflow-y-auto">
                  {countries.map(country => (
                    <label key={country} className="flex items-center px-6 py-1 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="mr-2"
                      />
                      <span className="text-sm">{country}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 액션 */}
          <div className="p-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              총 {selectedCountries.length}개 국가 선택됨
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              완료
            </button>
          </div>
        </div>
      )}

      {/* 선택된 국가 상세 표시 */}
      {selectedCountries.length > 0 && (
        <div className="text-sm text-gray-500 mt-1">
          선택된 국가: {selectedCountries.length > 0 ? selectedCountries.join(', ') : '없음'}
        </div>
      )}

      {/* 외부 클릭시 닫기 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 