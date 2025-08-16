import React, { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { Document } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SearchResult {
  documentId: string;
  documentName: string;
  excerpt: string;
  relevance: number;
}

export function SearchTab() {
  const [documents] = useLocalStorage<Document[]>('documents', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function (in real app, this would use ChatGPT API for semantic search)
  const mockSearch = async (query: string): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple keyword-based search for demo
    const results: SearchResult[] = [];
    
    documents.forEach(doc => {
      const content = doc.content.toLowerCase();
      const queryLower = query.toLowerCase();
      
      if (content.includes(queryLower) || queryLower.includes('田中') || queryLower.includes('プロジェクト')) {
        results.push({
          documentId: doc.id,
          documentName: doc.name,
          excerpt: `...${doc.content.substring(0, 200)}...`,
          relevance: Math.random() * 100,
        });
      }
    });
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await mockSearch(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      alert('検索中にエラーが発生しました');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">文書検索</h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              自然な文章で検索できます。例：「田中さんが欲しいと言っていたもの」「来週の予定について」
            </p>
            
            {/* Search Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="検索したい内容を入力してください..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSearching}
              />
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching || documents.length === 0}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? '検索中...' : '検索'}
              </button>
            </div>
            
            {documents.length === 0 && (
              <p className="text-warning-600 text-sm">
                検索するには、まず録音と文字起こしを行ってください。
              </p>
            )}
          </div>
        </div>

        {/* Search Results */}
        {(searchResults.length > 0 || isSearching) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              検索結果 {!isSearching && `(${searchResults.length}件)`}
            </h3>
            
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-gray-500">AIが文書を検索しています...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                検索結果が見つかりませんでした
              </p>
            ) : (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.documentId}-${index}`}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2 text-primary-600" />
                        {result.documentName}
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        関連度: {Math.round(result.relevance)}%
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {result.excerpt}
                    </p>
                    
                    <button
                      onClick={() => {
                        // In a real app, this would navigate to the document
                        alert('実際のアプリでは該当文書に移動します');
                      }}
                      className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      文書を表示 →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">検索のコツ</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 「〇〇さんが言っていた△△について」のような自然な文章で検索できます</li>
            <li>• 「来週」「予算」「プロジェクト」などのキーワードでも検索可能です</li>
            <li>• AIが文脈を理解して、関連する内容を見つけます</li>
            <li>• 複数の文書から関連する部分をまとめて表示します</li>
          </ul>
        </div>
      </div>
    </div>
  );
}