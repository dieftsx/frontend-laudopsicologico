import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, Database, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '../contexts/AuthContext';

// Configuração do axios
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const LaudoPsicologico = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated;
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [diagnostico, setDiagnostico] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paciente, setPaciente] = useState({
    nome: '',
    idade: '',
    dataNascimento: '',
    email: '',
    telefone: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setArquivos([...arquivos, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Criar paciente
      const pacienteResponse = await api.post('/pacientes/', {
        ...paciente,
        idade: parseInt(paciente.idade)
      });

      // Criar FormData para upload
      const formData = new FormData();
      arquivos.forEach(arquivo => {
        formData.append('arquivos', arquivo);
      });

      // Criar laudo
      const laudoResponse = await api.post(
        `/laudos/${pacienteResponse.data.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setDiagnostico(laudoResponse.data.diagnostico);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError((error as any).response?.data?.detail || 'Erro ao processar o laudo');
      } else {
        setError('Erro ao processar o laudo');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Sistema de Laudos Psicológicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Dados do Paciente</label>
              <input
                type="text"
                placeholder="Nome do Paciente"
                className="w-full p-2 border rounded"
                value={paciente.nome}
                onChange={(e) => setPaciente({...paciente, nome: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Idade"
                  className="p-2 border rounded"
                  value={paciente.idade}
                  onChange={(e) => setPaciente({...paciente, idade: e.target.value})}
                  required
                />
                <input
                  type="date"
                  className="p-2 border rounded"
                  value={paciente.dataNascimento}
                  onChange={(e) => setPaciente({...paciente, dataNascimento: e.target.value})}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={paciente.email}
                onChange={(e) => setPaciente({...paciente, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Telefone"
                className="w-full p-2 border rounded"
                value={paciente.telefone}
                onChange={(e) => setPaciente({...paciente, telefone: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Upload de Arquivos</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Clique para fazer upload dos arquivos
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Suporta arquivos Word, PDF e Excel
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Arquivos Carregados</label>
              <div className="border rounded p-2">
                {arquivos.length === 0 ? (
                  <p className="text-gray-500 text-center">Nenhum arquivo carregado</p>
                ) : (
                  <ul className="space-y-1">
                    {arquivos.map((arquivo, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {arquivo.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-blue-300"
            >
              <Database className="w-4 h-4" />
              {loading ? 'Processando...' : 'Gerar Diagnóstico'}
            </button>
          </form>

          {diagnostico && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <h3 className="font-medium mb-2">Diagnóstico Gerado</h3>
              <p>{diagnostico}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LaudoPsicologico;