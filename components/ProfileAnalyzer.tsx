import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, BarChart3, Star, Image, Activity, ShieldAlert, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import { analyzeProfile } from '../services/geminiService';
import { ProfileAnalysisResult, AppStatus } from '../types';
import { GOOGLE_COLORS } from '../constants';

export const ProfileAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<ProfileAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeProfile(input);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Erro na análise.");
      setStatus(AppStatus.ERROR);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return GOOGLE_COLORS.red;
    if (score < 80) return GOOGLE_COLORS.yellow;
    return GOOGLE_COLORS.green;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Análise de Potencial do Perfil</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ferramenta de inteligência para reuniões de vendas. Insira o link ou nome do GMB do cliente para gerar um diagnóstico instantâneo e argumentos para fechamento.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="Cole o link do Google Maps ou nome da empresa..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === AppStatus.LOADING}
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {status === AppStatus.LOADING ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Analisando...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Gerar Relatório
                </>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          
          {/* Coluna Principal: Score e Métricas */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Força do Perfil</h3>
                <div className="relative h-40 w-40 flex items-center justify-center">
                    <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-gray-100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={getScoreColor(result.profileStrength)}
                            strokeWidth="3"
                            strokeDasharray={`${result.profileStrength}, 100`}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold text-gray-900">{result.profileStrength}%</span>
                        <span className="text-xs text-gray-500 uppercase font-semibold">Score</span>
                    </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">{result.businessName}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
                <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Métricas Chave</h4>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Avaliações</span>
                    </div>
                    <span className="font-bold text-gray-900">{result.metrics.reviewCount} <span className="text-xs font-normal text-gray-400">({result.metrics.rating}★)</span></span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 gap-2">
                        <Image className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Fotos</span>
                    </div>
                    <span className="font-bold text-gray-900">{result.metrics.photoEstimate}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Atividade</span>
                    </div>
                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${result.metrics.activityLevel === 'Inativo' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {result.metrics.activityLevel}
                    </span>
                </div>
            </div>
          </div>

          {/* Coluna de Análise e Vendas */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Argumentos de Venda - Ouro do App */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldAlert className="h-32 w-32" />
                </div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
                    <ShieldAlert className="h-6 w-6 text-yellow-300" />
                    Argumentos para Fechamento
                </h3>
                <ul className="space-y-3 relative z-10">
                    {result.salesArguments.map((arg, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                            <ArrowRight className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                            <span className="text-sm md:text-base font-medium leading-relaxed">{arg}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Elementos Faltantes */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                    <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Pontos Críticos
                    </h4>
                    <ul className="space-y-2">
                        {result.missingElements.map((item, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400 mr-2"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Potencial de Crescimento */}
                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                     <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Potencial
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {result.potentialGrowth}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="text-xs font-bold text-blue-600 uppercase tracking-wide hover:text-blue-800 flex items-center">
                            Criar Proposta Agora <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};