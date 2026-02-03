import React, { useMemo } from 'react';
import { SavedQRCode, Client } from '../types';
import { Trash2, ExternalLink, Download, Briefcase, FolderOpen } from 'lucide-react';
import QRCode from 'react-qr-code';

interface SavedCodesProps {
  codes: SavedQRCode[];
  clients: Client[];
  onDelete: (id: string) => void;
  onEdit: (code: SavedQRCode) => void;
}

export const SavedCodes: React.FC<SavedCodesProps> = ({ codes, clients, onDelete, onEdit }) => {

  const downloadQR = (code: SavedQRCode) => {
    const svgId = `qr-${code.id}`;
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
          ctx.fillStyle = code.bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `FeedEmFoco-QR-${code.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Group codes by Client ID
  const groupedCodes = useMemo(() => {
    const groups: Record<string, SavedQRCode[]> = {
      'uncategorized': []
    };
    
    // Initialize groups for all clients (so even empty clients show up if desired, 
    // but here we might only want clients with codes. Let's stick to grouping existing codes).
    
    codes.forEach(code => {
      if (code.clientId && clients.find(c => c.id === code.clientId)) {
        if (!groups[code.clientId]) {
          groups[code.clientId] = [];
        }
        groups[code.clientId].push(code);
      } else {
        groups['uncategorized'].push(code);
      }
    });

    return groups;
  }, [codes, clients]);

  const getClientName = (id: string) => {
    const client = clients.find(c => c.id === id);
    return client ? client.companyName : 'Empresa Desconhecida';
  };

  if (codes.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <FolderOpen className="w-full h-full" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum código salvo</h3>
        <p className="mt-1 text-sm text-gray-500">Comece criando um QR Code ou buscando um link.</p>
      </div>
    );
  }

  // Helper to render grid of cards
  const renderCodeGrid = (codeList: SavedQRCode[]) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {codeList.map((code) => (
        <div key={code.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-center">
            <div className="bg-white p-2 rounded shadow-sm">
              <QRCode 
                id={`qr-${code.id}`}
                value={code.url} 
                size={140} 
                fgColor={code.color}
                bgColor={code.bgColor}
              />
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{code.name}</h3>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mb-3 truncate">
              <ExternalLink className="flex-shrink-0 h-3 w-3 mr-1" />
              <span className="truncate" title={code.url}>{code.url}</span>
            </div>

            <div className="mb-4">
              <button
                onClick={() => downloadQR(code)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <Download className="w-3 h-3" />
                Baixar PNG
              </button>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => onEdit(code)}
                className="flex-1 text-xs text-gray-500 hover:text-blue-600 font-medium py-1"
              >
                Editar
              </button>
              <div className="w-px bg-gray-200 my-1"></div>
              <button
                onClick={() => onDelete(code.id)}
                className="flex-1 text-xs text-red-400 hover:text-red-600 font-medium py-1"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Meus Códigos</h2>
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {codes.length} total
        </span>
      </div>

      {/* Render Categorized Groups */}
      {Object.keys(groupedCodes).map(clientId => {
        if (clientId === 'uncategorized') return null; // Skip for now, render at bottom
        
        return (
          <div key={clientId} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
               <Briefcase className="w-5 h-5 text-gray-500" />
               <h3 className="text-lg font-semibold text-gray-800">{getClientName(clientId)}</h3>
               <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                 {groupedCodes[clientId].length}
               </span>
            </div>
            {renderCodeGrid(groupedCodes[clientId])}
          </div>
        );
      })}

      {/* Render Uncategorized */}
      {groupedCodes['uncategorized'].length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
             <FolderOpen className="w-5 h-5 text-gray-400" />
             <h3 className="text-lg font-semibold text-gray-600">Sem Vínculo / Outros</h3>
             <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
               {groupedCodes['uncategorized'].length}
             </span>
          </div>
          {renderCodeGrid(groupedCodes['uncategorized'])}
        </div>
      )}

    </div>
  );
};