import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { QRGenerator } from './components/QRGenerator';
import { SavedCodes } from './components/SavedCodes';
import { LeadManager } from './components/LeadManager';
import { ClientManager } from './components/ClientManager';
import { IdeaBank } from './components/IdeaBank';
import { SavedQRCode, Lead, Client, Idea } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  
  // Data States
  const [savedCodes, setSavedCodes] = useState<SavedQRCode[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('base44_codes');
    const savedLeads = localStorage.getItem('base44_leads');
    const savedClients = localStorage.getItem('base44_clients');
    const savedIdeas = localStorage.getItem('base44_ideas');
    
    if (saved) {
      try {
        setSavedCodes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved codes", e);
      }
    }

    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        console.error("Failed to parse saved leads", e);
      }
    }

    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients));
      } catch (e) {
        console.error("Failed to parse saved clients", e);
      }
    }

    if (savedIdeas) {
      try {
        setIdeas(JSON.parse(savedIdeas));
      } catch (e) {
        console.error("Failed to parse saved ideas", e);
      }
    }
  }, []);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('base44_codes', JSON.stringify(savedCodes));
  }, [savedCodes]);

  useEffect(() => {
    localStorage.setItem('base44_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('base44_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('base44_ideas', JSON.stringify(ideas));
  }, [ideas]);

  // QR Handlers
  const handleSaveQR = (newCode: SavedQRCode) => {
    setSavedCodes(prev => [newCode, ...prev]);
    setActiveTab('saved');
    setSelectedUrl('');
    setSelectedName('');
    setSelectedClientId(undefined);
  };

  const handleDeleteQR = (id: string) => {
    setSavedCodes(prev => prev.filter(c => c.id !== id));
  };

  const handleEditQR = (code: SavedQRCode) => {
    setSelectedUrl(code.url);
    setSelectedName(code.name);
    setSelectedClientId(code.clientId);
    setActiveTab('generator');
  };

  // Lead Handlers
  const handleAddLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  // Client Handlers
  const handleAddClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  // Idea Handlers
  const handleAddIdea = (newIdea: Idea) => {
    setIdeas(prev => [newIdea, ...prev]);
  };

  const handleUpdateIdea = (updatedIdea: Idea) => {
    setIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto">
        
        {activeTab === 'generator' && (
           <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <QRGenerator 
                initialUrl={selectedUrl} 
                initialName={selectedName}
                initialClientId={selectedClientId}
                clients={clients}
                onSave={handleSaveQR}
             />
           </div>
        )}

        {activeTab === 'leads' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LeadManager 
              leads={leads}
              onAddLead={handleAddLead}
              onUpdateLead={handleUpdateLead}
              onDeleteLead={handleDeleteLead}
            />
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ClientManager 
              clients={clients}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
            />
          </div>
        )}

        {activeTab === 'ideas' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IdeaBank 
              ideas={ideas}
              onAddIdea={handleAddIdea}
              onUpdateIdea={handleUpdateIdea}
              onDeleteIdea={handleDeleteIdea}
            />
          </div>
        )}

        {activeTab === 'saved' && (
           <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <SavedCodes 
                codes={savedCodes} 
                clients={clients}
                onDelete={handleDeleteQR}
                onEdit={handleEditQR}
             />
           </div>
        )}
      </div>
    </Layout>
  );
}

export default App;