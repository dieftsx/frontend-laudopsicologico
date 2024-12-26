import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  FileText, 
  Upload, 
  Zap, 
  BookOpen, 
  Activity, 
  Lightbulb 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaginaAnaliseIA = () => {
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [textoAnalise, setTextoAnalise] = useState('');
  const [resultadosIA, setResultadosIA] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const arquivo = event.target.files[0];
    setArquivoSelecionado(arquivo);

    // Ler conteúdo do arquivo
    const reader = new FileReader();
    reader.onload = (e) => {
      setTextoAnalise(e.target.result);
    };
    reader.readAsText(arquivo);
  };

  const analisarDiagnosticoComIA = async () => {
    if (!textoAnalise) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/diagnostico/ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ texto: textoAnalise })
      });

      const dados = await response.json();
      setResultadosIA(dados);
    } catch (error) {
      console.error('Erro na análise de IA:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            Análise de Diagnóstico por IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload de Arquivo para Análise</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Selecionar Arquivo
                </label>
                {arquivoSelecionado && (
                  <p className="mt-2 text-sm text-gray-500">
                    Arquivo selecionado: {arquivoSelecionado.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Texto para Análise</label>
              <textarea
                className="w-full border rounded p-2 min-h-[200px]"
                value={textoAnalise}
                onChange={(e) => setTextoAnalise(e.target.value)}
                placeholder="Cole o texto do diagnóstico ou edite após o upload"
              />
            </div>

            <button
              onClick={analisarDiagnosticoComIA}
              disabled={loading || !textoAnalise}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {loading ? 'Analisando...' : 'Analisar com IA'}
            </button>

            {resultadosIA && (
              <div className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Probabilidades de Diagnóstico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resultadosIA.diagnostico_ia.map((diag, index) => (
                      <div key={index} className="flex justify-between bg-gray-100 p-2 rounded mt-2">
                        <span>{diag.categoria}</span>
                        <span>{(diag.probabilidade * 100).toFixed(2)}%</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Recomendações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside bg-gray-100 p-3 rounded">
                      {resultadosIA.recomendacoes.map((rec, index) => (
                        <li key={index} className="mb-2">{rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Sintomas Relacionados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {resultadosIA.sintomas_relacionados.map((sintoma, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-100 p-2 rounded"
                        >
                          <strong>{sintoma.sintoma}</strong>
                          <p className="text-sm">{sintoma.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaAnaliseIA;