import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { LEAD_STAGES, GOOGLE_COLORS } from '../constants';
import { Plus, Edit2, Trash2, Phone, Calendar, User, AlignLeft, DollarSign, X, Search, Filter } from 'lucide-react';

interface LeadManagerProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

export const LeadManager: React.FC<LeadManagerProps> = ({ leads, onAddLead, onUpdateLead, onDeleteLead }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Lead>>({
    businessName: '',
    contactName: '',
    phone: '',
    status: 'visit',
    notes: '',
    value: ''
  });

  // Derived State: Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.contactName && lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openNewLeadModal = () => {
    setEditingLead(null);
    setFormData({
      businessName: '',
      contactName: '',
      phone: '',
      status: 'visit',
      notes: '',
      value: ''
    });
    setIsModalOpen(true);
  };

  const openEditLeadModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLead) {
      onUpdateLead({
        ...editingLead,
        ...formData as Lead,
        updatedAt: Date.now()
      });
    } else {
      const newLead: Lead = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        businessName: formData.businessName || 'Sem nome',
        contactName: formData.contactName || '',
        phone: formData.phone || '',
        status: formData.status as LeadStatus || 'visit',
        notes: formData.notes || '',
        value: formData.value || ''
      };
      onAddLead(newLead);
    }
    setIsModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("leadId", id);
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    const id = e.dataTransfer.getData("leadId");
    const lead = leads.find(l => l.id === id);
    if (lead && lead.status !== status) {
      onUpdateLead({ ...lead, status, updatedAt: Date.now() });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Leads</h2>
          <p className="text-gray-500 text-sm">Acompanhe a trajetória dos seus clientes</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:min-w-[240px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou contato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative sm:min-w-[180px]">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
            >
              <option value="all">Todas as Etapas</option>
              {LEAD_STAGES.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={openNewLeadModal}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Board Container - Horizontal Scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full" style={{ minWidth: statusFilter === 'all' ? '2000px' : '300px' }}>
          {LEAD_STAGES
            .filter(stage => statusFilter === 'all' || stage.id === statusFilter)
            .map((stage) => (
            <div 
              key={stage.id} 
              className="flex-shrink-0 w-72 flex flex-col bg-gray-100 rounded-xl max-h-full"
              onDrop={(e) => handleDrop(e, stage.id as LeadStatus)}
              onDragOver={handleDragOver}
            >
              {/* Column Header */}
              <div 
                className="p-3 rounded-t-xl border-b border-gray-200 flex items-center gap-2 bg-white sticky top-0 z-10"
                style={{ borderTop: `4px solid ${stage.color}` }}
              >
                <stage.icon className="w-4 h-4" style={{ color: stage.color }} />
                <h3 className="font-semibold text-sm text-gray-700">{stage.label}</h3>
                <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs font-medium">
                  {filteredLeads.filter(l => l.status === stage.id).length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-2 space-y-3">
                {filteredLeads
                  .filter(l => l.status === stage.id)
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{lead.businessName}</h4>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditLeadModal(lead); }}
                        className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>

                    {lead.contactName && (
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <User className="w-3 h-3 mr-1" />
                        {lead.contactName}
                      </div>
                    )}

                    {lead.value && (
                       <div className="flex items-center text-xs text-green-600 mb-1 font-medium">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {lead.value}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                      <span>{new Date(lead.updatedAt).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                         {lead.phone && <Phone className="w-3 h-3 text-gray-400" />}
                         {lead.notes && <AlignLeft className="w-3 h-3 text-blue-400" />}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredLeads.filter(l => l.status === stage.id).length === 0 && (
                   <div className="text-center py-8 text-gray-400 text-xs italic">
                     Nenhum lead nesta etapa
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-slide-up">
            <div className="absolute top-4 right-4">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingLead ? 'Editar Lead' : 'Novo Lead'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Negócio</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome Contato</label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700">Status / Etapa</label>
                   <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as LeadStatus})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   >
                     {LEAD_STAGES.map(stage => (
                       <option key={stage.id} value={stage.id}>{stage.label}</option>
                     ))}
                   </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor Estimado (Opcional)</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Anotações / Histórico</label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Registre aqui detalhes da visita, pontos de dor do cliente, etc..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-6">
                  {editingLead ? (
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteLead(editingLead.id);
                        setIsModalOpen(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </button>
                  ) : (
                    <div></div> // Spacer
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};