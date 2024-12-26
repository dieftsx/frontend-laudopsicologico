import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const HistoricoDiagnosticos = () => {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [periodo, setPeriodo] = useState('todos');

  useEffect(() => {
    carregarDiagnosticos();
  }, []);

  const carregarDiagnosticos = async () => {
    try {
      const response = await fetch('http://localhost:8000/laudos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setDiagnosticos(data);
    } catch (error) {
      console.error('Erro ao carregar diagnósticos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarDiagnosticos = () => {
    return diagnosticos.filter((diagnostico: any) => {
      const matchFiltro = diagnostico.paciente?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
                         diagnostico.id?.toLowerCase().includes(filtro.toLowerCase()) || '';
      
      if (periodo === 'todos') return matchFiltro;
      const data = new Date(diagnostico.criado_em);
      const hoje = new Date();
      const diffDias = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
      
      switch(periodo) {
        case '7dias': return diffDias <= 7 && matchFiltro;
        case '30dias': return diffDias <= 30 && matchFiltro;
        case '6meses': return diffDias <= 180 && matchFiltro;
        default: return matchFiltro;
      }
    });
  };

  const baixarPDF = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/laudos/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laudo-${id}.pdf`;
      a.click();
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Histórico de Diagnósticos
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome do paciente ou ID..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                className="border rounded-lg px-4 py-2"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <option value="todos">Todos os períodos</option>
                <option value="7dias">Últimos 7 dias</option>
                <option value="30dias">Últimos 30 dias</option>
                <option value="6meses">Últimos 6 meses</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Carregando diagnósticos...</div>
          ) : (
            <div className="space-y-4">
              {filtrarDiagnosticos().map((diagnostico: any) => (
                <Card key={diagnostico.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg mb-2">
                          {diagnostico.paciente.nome}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          ID: {diagnostico.id}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          Data: {new Date(diagnostico.criado_em).toLocaleDateString()}
                        </p>
                        <div className="bg-white p-3 rounded-lg mt-2">
                          <p className="text-sm">{diagnostico.diagnostico}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => baixarPDF(diagnostico.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricoDiagnosticos;