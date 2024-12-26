import React from 'react';
import { Home, ClipboardList, History } from 'lucide-react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LaudoPsicologico from '@/pages/LaudoPsicologico';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <ClipboardList className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">Sistema de Laudos</span>
              </div>
              <div className="ml-6 flex space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  <Home className="h-5 w-5 mr-1" />
                  Início
                </button>
                <button
                  onClick={() => navigate('/historico')}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  <History className="h-5 w-5 mr-1" />
                  Histórico
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<LaudoPsicologico />} />
            <Route path="/historico" element={<HistoricoDiagnosticos />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const HistoricoDiagnosticos = () => {
  // Dados simulados de exemplo
  const historico = [
    {
      id: 1,
      paciente: 'João Silva',
      data: '2024-12-20',
      diagnostico: 'Diagnóstico detalhado do paciente...',
      status: 'Finalizado'
    },
    {
      id: 2,
      paciente: 'Maria Santos',
      data: '2024-12-18',
      diagnostico: 'Diagnóstico detalhado da paciente...',
      status: 'Em análise'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-6 h-6" />
            Histórico de Diagnósticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historico.map((laudo) => (
              <div
                key={laudo.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{laudo.paciente}</h3>
                    <p className="text-sm text-gray-500">Data: {laudo.data}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    laudo.status === 'Finalizado' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {laudo.status}
                  </span>
                </div>
                <p className="text-gray-700">{laudo.diagnostico}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                    Ver Detalhes
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                    Baixar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Navigation;