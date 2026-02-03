import { FileText, MapPin, QrCode, Search, Share2, Download, Save, Trash2, Users, Phone, Calendar, DollarSign, CheckCircle, XCircle, Clock, MessageCircle, Briefcase, BarChart3, Lightbulb } from 'lucide-react';

export const GOOGLE_COLORS = {
  blue: '#4285F4',
  red: '#DB4437',
  yellow: '#F4B400',
  green: '#0F9D58',
  gray: '#5f6368',
  white: '#ffffff',
  lightGray: '#f1f3f4',
  purple: '#A142F4',
  orange: '#F48400'
};

export const TABS = [
  { id: 'generator', label: 'Criar QR Code', icon: QrCode },
  { id: 'leads', label: 'Gestão de Leads', icon: Users },
  { id: 'clients', label: 'Clientes', icon: Briefcase },
  { id: 'ideas', label: 'Banco de Ideias', icon: Lightbulb },
  { id: 'saved', label: 'Meus Códigos', icon: Save },
];

export const QR_PRESETS = [
  { name: 'Clássico', fg: '#000000', bg: '#ffffff' },
  { name: 'Google Blue', fg: GOOGLE_COLORS.blue, bg: '#ffffff' },
  { name: 'Google Red', fg: GOOGLE_COLORS.red, bg: '#ffffff' },
  { name: 'Google Green', fg: GOOGLE_COLORS.green, bg: '#ffffff' },
];

export const LEAD_STAGES = [
  { id: 'visit', label: 'Visita / Prospecção', color: GOOGLE_COLORS.gray, icon: MapPin },
  { id: 'contact', label: 'Contato Inicial', color: GOOGLE_COLORS.blue, icon: Phone },
  { id: 'return', label: 'Retorno', color: GOOGLE_COLORS.purple, icon: MessageCircle },
  { id: 'followup', label: 'Follow Up', color: GOOGLE_COLORS.yellow, icon: Clock },
  { id: 'nurture', label: 'Nutrição', color: GOOGLE_COLORS.orange, icon: Calendar },
  { id: 'closing', label: 'Fechamento', color: GOOGLE_COLORS.red, icon: DollarSign },
  { id: 'won', label: 'Ganho', color: GOOGLE_COLORS.green, icon: CheckCircle },
  { id: 'lost', label: 'Perdido', color: '#9aa0a6', icon: XCircle },
];

export const IDEA_TAGS = [
  { id: 'narrado', label: 'Narrado', color: 'bg-blue-100 text-blue-800' },
  { id: 'drone', label: 'Drone', color: 'bg-sky-100 text-sky-800' },
  { id: 'antes_depois', label: 'Antes e Depois', color: 'bg-green-100 text-green-800' },
  { id: 'bastidores', label: 'Bastidores', color: 'bg-gray-100 text-gray-800' },
  { id: 'engajamento', label: 'Engajamento', color: 'bg-pink-100 text-pink-800' },
  { id: 'meme', label: 'Meme', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'trend', label: 'Trend', color: 'bg-purple-100 text-purple-800' },
  { id: 'autoridade', label: 'Autoridade', color: 'bg-indigo-100 text-indigo-800' },
];