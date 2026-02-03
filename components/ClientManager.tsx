import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Edit2, Trash2, Search, Phone, Calendar, Globe, MapPin, DollarSign, X, ExternalLink, User } from 'lucide-react';
import { GOOGLE_COLORS } from '../constants';

interface ClientManagerProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const emptyForm: Partial<Client> = {
    companyName: '',
    segment: '',
    contactName: '',
    whatsapp: '',
    socialMedia: '',
    gmbProfile: '',
    serviceHired: '',
    serviceValue: '',
    paymentDate: '',
    recurrenceDate: ''
  };

  const [formData, setFormData] = useState<Partial<Client>>(emptyForm);

  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.segment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewClientModal = () => {
    setEditingClient(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditClientModal = (client: Client) => {
    setEditingClient(client);
    setFormData(client);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData = {
        ...formData as Client,
        updatedAt: Date.now()
    };

    if (editingClient) {
      onUpdateClient({
        ...editingClient,
        ...clientData
      });
    } else {
      onAddClient({
        ...clientData,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      });
    }
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
      if (!dateString) return '-';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Carteira de Clientes</h2>
          <p className="text-gray-500 text-sm">Gerencie contratos, recorrências e dados de contato</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <button
            onClick={openNewClientModal}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
            >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
            </button>
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                    <User className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum cliente encontrado</h3>
                <p className="text-gray-500">Adicione um novo cliente para começar a gerenciar.</p>
            </div>
        ) : (
            filteredClients.map((client) => (
                <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group">
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 truncate">{client.companyName}</h3>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                    {client.segment}
                                </span>
                            </div>
                            <button 
                                onClick={() => openEditClientModal(client)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                             <div className="flex items-center text-sm text-gray-600">
                                <User className="h-4 w-4 mr-2 text-gray-400" />
                                {client.contactName}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-green-500" />
                                {client.whatsapp}
                            </div>

                             <div className="border-t border-gray-100 my-3 pt-3">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Serviço Contratado</p>
                                <p className="text-sm font-medium text-gray-900">{client.serviceHired}</p>
                                <p className="text-sm text-green-600 font-bold mt-1">R$ {client.serviceValue}</p>
                             </div>

                             <div className="flex justify-between items-center text-xs bg-blue-50 p-2 rounded text-blue-800">
                                <span>Recorrência:</span>
                                <span className="font-bold flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(client.recurrenceDate)}
                                </span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
                        <div className="flex space-x-3">
                            {client.gmbProfile && (
                                <a href={client.gmbProfile} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600" title="Google Meu Negócio">
                                    <MapPin className="h-4 w-4" />
                                </a>
                            )}
                            {client.socialMedia && (
                                <a href={client.socialMedia} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600" title="Redes Sociais">
                                    <Globe className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                        <button 
                             onClick={() => {
                                 if(window.confirm('Tem certeza que deseja excluir este cliente?')) {
                                     onDeleteClient(client.id);
                                 }
                             }}
                             className="text-red-400 hover:text-red-600 text-xs font-medium flex items-center"
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Excluir
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
             <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                    {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                </button>
             </div>

             <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Dados da Empresa */}
                <div>
                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
                        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                        Dados da Empresa & Contato
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                            <input
                                type="text"
                                required
                                value={formData.companyName}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Segmento</label>
                            <input
                                type="text"
                                placeholder="Ex: Restaurante, Clínica"
                                value={formData.segment}
                                onChange={(e) => setFormData({...formData, segment: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Nome do Contato</label>
                            <input
                                type="text"
                                value={formData.contactName}
                                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                            <input
                                type="text"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Financeiro e Serviço */}
                <div>
                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4 mt-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                        Serviço & Financeiro
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Serviço Contratado</label>
                            <input
                                type="text"
                                value={formData.serviceHired}
                                onChange={(e) => setFormData({...formData, serviceHired: e.target.value})}
                                placeholder="Ex: Gestão de Tráfego, Social Media"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                            <input
                                type="text"
                                value={formData.serviceValue}
                                onChange={(e) => setFormData({...formData, serviceValue: e.target.value})}
                                placeholder="0,00"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Data Recorrência</label>
                            <input
                                type="date"
                                value={formData.recurrenceDate}
                                onChange={(e) => setFormData({...formData, recurrenceDate: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Último Pagamento</label>
                            <input
                                type="date"
                                value={formData.paymentDate}
                                onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4 mt-2">
                        <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                        Links Externos
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link Google Meu Negócio</label>
                            <input
                                type="url"
                                value={formData.gmbProfile}
                                onChange={(e) => setFormData({...formData, gmbProfile: e.target.value})}
                                placeholder="https://g.page/..."
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link Redes Sociais</label>
                            <input
                                type="url"
                                value={formData.socialMedia}
                                onChange={(e) => setFormData({...formData, socialMedia: e.target.value})}
                                placeholder="Instagram, Facebook..."
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Salvar Cliente
                    </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};