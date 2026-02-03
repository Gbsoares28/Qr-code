import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { findBusinessReviewLink } from '../services/geminiService';
import { GMBResult, AppStatus } from '../types';
import { GOOGLE_COLORS } from '../constants';

interface GMBFinderProps {
  onFound: (url: string, name: string) => void;
}

export const GMBFinder: React.FC<GMBFinderProps> = ({ onFound }) => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GMBResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await findBusinessReviewLink(businessName, location);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar informações.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Gerador de Link de Avaliação</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Utilize a IA do Google para encontrar o link direto de avaliação do seu perfil Google Meu Negócio.
          Isso aumenta sua conversão e reputação.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 opacity-80"></div>
        <div className="p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Negócio
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="business"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow sm:text-sm"
                  placeholder="Ex: Padaria do João"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade/Bairro (Opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow sm:text-sm"
                  placeholder="Ex: São Paulo"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === AppStatus.LOADING}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === AppStatus.LOADING ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Buscando...
                </>
              ) : (
                'Encontrar Link'
              )}
            </button>
          </form>
        </div>
      </div>

      {status === AppStatus.ERROR && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {status === AppStatus.SUCCESS && result && (
        <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden animate-slide-up">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                     <Search className="h-5 w-5 text-green-600" />
                  </span>
                  {result.businessName}
                </h3>
                <p className="mt-1 text-sm text-gray-500 ml-10">{result.address}</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Link de Avaliação Encontrado</label>
              <div className="flex items-center gap-2 break-all text-blue-600 text-sm font-mono">
                 {result.reviewUrl}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a 
                href={result.reviewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Testar Link
              </a>
              <button
                onClick={() => onFound(result.reviewUrl, result.businessName)}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Gerar QR Code
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};