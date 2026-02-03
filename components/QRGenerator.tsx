import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Download, Save, RefreshCw, Copy, Check, Briefcase } from 'lucide-react';
import { QR_PRESETS, GOOGLE_COLORS } from '../constants';
import { SavedQRCode, Client } from '../types';

interface QRGeneratorProps {
  initialUrl?: string;
  initialName?: string;
  initialClientId?: string;
  clients: Client[];
  onSave: (qr: SavedQRCode) => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ 
  initialUrl = '', 
  initialName = '', 
  initialClientId = '', 
  clients,
  onSave 
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [name, setName] = useState(initialName);
  const [clientId, setClientId] = useState(initialClientId);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);
  
  // Update state if props change (e.g., coming from Finder or Edit)
  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
    if (initialName) setName(initialName);
    if (initialClientId) setClientId(initialClientId);
  }, [initialUrl, initialName, initialClientId]);

  const svgRef = useRef<any>(null);

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40; // Add padding
      canvas.height = img.height + 40;
      if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `FeedEmFoco-QR-${name || 'code'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleSave = () => {
    if (!url) return;
    const newQR: SavedQRCode = {
      id: crypto.randomUUID(),
      name: name || 'Sem nome',
      url, 
      createdAt: Date.now(),
      color: fgColor,
      bgColor: bgColor,
      clientId: clientId || undefined
    };
    onSave(newQR);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* Editor Column */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Configuração do QR Code
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Destino</label>
              <div className="flex rounded-md shadow-sm">
                 <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://g.page/..."
                  className="flex-1 min-w-0 block w-full px-3 py-3 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                  title="Copiar URL"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto (Opcional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mesa 01, Fachada..."
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vincular a Empresa (Opcional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Briefcase className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="block w-full pl-10 px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  >
                    <option value="">Sem vínculo</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-medium text-gray-900 mb-4">Estilização</h3>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
             <div>
               <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Cor do QR</label>
               <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={fgColor} 
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 font-mono">{fgColor}</span>
               </div>
             </div>
             <div>
               <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Cor de Fundo</label>
               <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 font-mono">{bgColor}</span>
               </div>
             </div>
           </div>

           <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Presets Google</label>
              <div className="flex flex-wrap gap-2">
                {QR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => { setFgColor(preset.fg); setBgColor(preset.bg); }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:shadow-sm"
                    style={{ 
                      borderColor: preset.fg === '#ffffff' ? '#e5e7eb' : preset.fg, 
                      color: preset.fg === '#ffffff' ? '#000000' : preset.fg,
                      backgroundColor: preset.fg === '#ffffff' ? '#000000' : '#ffffff'
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-5">
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
             <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
                <p className="text-xs text-blue-700 text-center font-medium">Pré-visualização</p>
             </div>
            <div className="p-8 flex flex-col items-center justify-center bg-gray-50 min-h-[350px]">
              {url ? (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <QRCode
                    id="qr-code-svg"
                    value={url}
                    size={200}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <RefreshCw className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Insira uma URL para gerar o código</p>
                </div>
              )}
              
              {name && url && (
                <p className="mt-6 text-lg font-bold text-gray-800">{name}</p>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleSave}
                disabled={!url}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Código
              </button>
              <button
                onClick={handleDownload}
                disabled={!url}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};