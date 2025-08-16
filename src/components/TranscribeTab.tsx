import React, { useState } from 'react';
import { FileText, Download, Edit3, Check, X, Trash2, Copy, Brain } from 'lucide-react';
import { Recording, Document } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatDate } from '../utils/formatTime';
import { generatePDF } from '../utils/pdfGenerator';

export function TranscribeTab() {
  const [recordings] = useLocalStorage<Recording[]>('recordings', []);
  const [documents, setDocuments] = useLocalStorage<Document[]>('documents', []);
  const [selectedRecording, setSelectedRecording] = useState<string>('');
  const [transcriptionMode, setTranscriptionMode] = useState<'minutes' | 'full'>('minutes');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Mock transcription function (in real app, this would call Google Speech-to-Text API)
  const mockTranscription = (mode: 'minutes' | 'full') => {
    if (mode === 'minutes') {
      return `## 会議議事録

### 開催情報
- 日時: ${formatDate(new Date())}
- 参加者: 田中さん、佐藤さん、鈴木さん

### 議題1: プロジェクト進捗について
- 田中さん: 現在の進捗は80%です
- 佐藤さん: 来週までにテストを完了予定
- 決定事項: リリース日を来月15日に設定

### 議題2: 予算について
- 鈴木さん: 追加予算が必要になる可能性があります
- 検討事項: 来週の役員会議で相談

### 次回会議
- 日程: 来週金曜日 14:00-15:00`;
    } else {
      return `## 全文記録

[00:00] 田中: お疲れ様です。それでは会議を始めさせていただきます。

[00:15] 佐藤: よろしくお願いします。

[00:20] 田中: まず、プロジェクトの進捗についてですが、現在80%まで完了しています。

[00:35] 佐藤: テストについては来週までに完了予定です。何か問題があれば連絡します。

[00:50] 鈴木: 承知しました。予算の件ですが、少し追加が必要になるかもしれません。

[01:05] 田中: 分かりました。それでは来週の役員会議で相談しましょう。

[01:20] 佐藤: リリース日はどうしますか？

[01:25] 田中: 来月の15日で進めましょう。

[01:30] 鈴木: 了解です。

[01:35] 田中: それでは、次回は来週金曜日の14時からということで。お疲れ様でした。`;
    }
  };

  const handleTranscribe = async () => {
    if (!selectedRecording) return;
    
    const recording = recordings.find(r => r.id === selectedRecording);
    if (!recording) return;

    setIsTranscribing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const transcriptionContent = mockTranscription(transcriptionMode);
    
    const newDocument: Document = {
      id: Date.now().toString(),
      recordingId: recording.id,
      name: recording.name,
      date: formatDate(new Date()),
      content: transcriptionContent,
      mode: transcriptionMode,
      recordingDuration: recording.duration,
    };
    
    if (documents.length < 15) {
      setDocuments([...documents, newDocument]);
    }
    
    setIsTranscribing(false);
    setSelectedRecording('');
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('この文書を削除しますか？')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  const handleEditDocument = (document: Document) => {
    setEditingId(document.id);
    setEditingContent(document.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editingContent.trim()) {
      setDocuments(documents.map(d => 
        d.id === editingId ? { ...d, content: editingContent.trim() } : d
      ));
    }
    setEditingId(null);
    setEditingContent('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('内容をクリップボードにコピーしました');
  };

  const handleDownloadPDF = (document: Document) => {
    generatePDF(document.name, document.content, document.date);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Transcription Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">文字起こし</h2>
          
          <div className="space-y-6">
            {/* Recording Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                録音を選択
              </label>
              <select
                value={selectedRecording}
                onChange={(e) => setSelectedRecording(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">録音を選択してください</option>
                {recordings.map((recording) => (
                  <option key={recording.id} value={recording.id}>
                    {recording.name} ({recording.date})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出力モード
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="minutes"
                    checked={transcriptionMode === 'minutes'}
                    onChange={(e) => setTranscriptionMode(e.target.value as 'minutes' | 'full')}
                    className="mr-2"
                  />
                  議事録モード
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="full"
                    checked={transcriptionMode === 'full'}
                    onChange={(e) => setTranscriptionMode(e.target.value as 'minutes' | 'full')}
                    className="mr-2"
                  />
                  全文モード
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {transcriptionMode === 'minutes' 
                  ? '議題ごとに構成された文書を生成します' 
                  : '発言を時系列にそのまま記録します'
                }
              </p>
            </div>
            
            {/* Transcribe Button */}
            <button
              onClick={handleTranscribe}
              disabled={!selectedRecording || isTranscribing || documents.length >= 15}
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Brain className="w-5 h-5 mr-2" />
              {isTranscribing ? '文字起こし中...' : '文字起こし開始'}
            </button>
            
            {documents.length >= 15 && (
              <p className="text-warning-600 text-sm">
                ⚠️ 文書は最大15件まで保存できます。新しい文書を作成するには、既存の文書を削除してください。
              </p>
            )}
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            保存済み文書 ({documents.length}/15)
          </h3>
          
          {documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">文書がありません</p>
          ) : (
            <div className="space-y-6">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        {document.name}
                        <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded">
                          {document.mode === 'minutes' ? '議事録' : '全文'}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {document.date}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleCopyContent(document.content)}
                        className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                        title="コピー"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(document)}
                        className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors"
                        title="PDF出力"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditDocument(document)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        title="編集"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  {editingId === document.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          キャンセル
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          保存
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-md p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                        {document.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}