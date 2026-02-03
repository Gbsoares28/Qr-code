import React, { useState } from 'react';
import { Idea } from '../types';
import { IDEA_TAGS } from '../constants';
import { Plus, Search, ExternalLink, Trash2, Edit2, Youtube, Instagram, Link as LinkIcon, X, Tag, Filter } from 'lucide-react';

interface IdeaBankProps {
  ideas: Idea[];
  onAddIdea: (idea: Idea) => void;
  onUpdateIdea: (idea: Idea) => void;
  onDeleteIdea: (id: string) => void;
}

export const IdeaBank: React.FC<IdeaBankProps> = ({ ideas, onAddIdea, onUpdateIdea, onDeleteIdea }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  const initialFormState: Partial<Idea> = {
    title: '',
    url: '',
    tags: [],
    notes: '',
    platform: 'other'
  };

  const [formData, setFormData] = useState<Partial<Idea>>(initialFormState);

  // Helper para identificar plataforma
  const getPlatformFromUrl = (url: string): 'instagram' | 'youtube' | 'other' => {
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    return 'other';
  };

  const openNewIdeaModal = () => {
    setEditingIdea(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditIdeaModal = (idea: Idea) => {
    setEditingIdea(idea);
    setFormData(idea);
    setIsModalOpen(true);
  };

  const toggleTag = (tagId: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tagId)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tagId) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tagId] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const platform = getPlatformFromUrl(formData.url || '');
    
    if (editingIdea) {
      onUpdateIdea({
        ...editingIdea,
        ...formData as Idea,
        platform
      });
    } else {
      onAddIdea({
        id: crypto.randomUUID(),
        title: formData.title || 'Nova Ideia',
        url: formData.url || '',
        tags: formData.tags || [],
        notes: formData.notes || '',
        platform,
        createdAt: Date.now()
      });
    }
    setIsModalOpen(false);
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idea.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag ? idea.tags.includes(filterTag) : true;
    return matchesSearch && matchesTag;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-600" />;
      default: return <LinkIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banco de Ideias</h2>
          <p className="text-gray-500 text-sm">Salve referências para recriar conteúdos estratégicos</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-[200px]">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar ideia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
          </div>

           <div className="relative sm:min-w-[160px]">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
            >
              <option value="">Todas as Tags</option>
              {IDEA_TAGS.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={openNewIdeaModal}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Ideia
          </button>
        </div>
      </div>

      {/* Grid de Ideias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
             <div className="mx-auto h-12 w-12 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-3">
               <Plus className="h-6 w-6" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">Banco de ideias vazio</h3>
             <p className="text-gray-500">Adicione vídeos de inspiração para começar.</p>
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2">
                      {getPlatformIcon(idea.platform)}
                      <span className="text-xs font-medium text-gray-500 uppercase">{idea.platform}</span>
                   </div>
                   <div className="flex gap-1">
                     <button onClick={() => openEditIdeaModal(idea)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                       <Edit2 className="w-4 h-4" />
                     </button>
                     <button 
                        onClick={() => {
                          if(window.confirm('Excluir esta ideia?')) onDeleteIdea(idea.id);
                        }} 
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{idea.title}</h3>
                
                {idea.notes && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 italic">"{idea.notes}"</p>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                  {idea.tags.map(tagId => {
                    const tagInfo = IDEA_TAGS.find(t => t.id === tagId);
                    return tagInfo ? (
                      <span key={tagId} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tagInfo.color}`}>
                        {tagInfo.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <a 
                  href={idea.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Link Original
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <h3 className="text-xl font-bold text-gray-900">
                   {editingIdea ? 'Editar Ideia' : 'Nova Ideia'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                   <X className="w-6 h-6" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título / Tema</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Vídeo Institucional Drone"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Link do Vídeo (Instagram/YouTube)</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags / Estilo</label>
                <div className="flex flex-wrap gap-2">
                  {IDEA_TAGS.map(tag => {
                    const isSelected = formData.tags?.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`
                          inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                          ${isSelected 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}
                        `}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Anotações para Recriação</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="O que copiar? Áudio, ângulos, transição..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
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
                   Salvar Ideia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};