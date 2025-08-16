import React, { useState } from 'react';
import { User, Trash2, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function SettingsTab() {
  const [recordings, setRecordings] = useLocalStorage<any[]>('recordings', []);
  const [documents, setDocuments] = useLocalStorage<any[]>('documents', []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', { id: '1', username: 'ユーザー' });

  const handleDeleteAllData = () => {
    // Clean up audio URLs
    recordings.forEach(recording => {
      if (recording.audioUrl) {
        URL.revokeObjectURL(recording.audioUrl);
      }
    });
    
    setRecordings([]);
    setDocuments([]);
    setShowDeleteConfirm(false);
    alert('すべてのデータを削除しました');
  };

  const handleAccountDeletion = () => {
    if (confirm('アカウントを削除すると、すべてのデータが失われます。この操作は取り消せません。\n\n本当にアカウントを削除しますか？')) {
      // Clean up all data
      recordings.forEach(recording => {
        if (recording.audioUrl) {
          URL.revokeObjectURL(recording.audioUrl);
        }
      });
      
      localStorage.clear();
      alert('アカウントとすべてのデータを削除しました。\n\nページをリロードしてください。');
      window.location.reload();
    }
  };

  const getTotalStorageUsage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return (total / 1024).toFixed(2); // KB
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Settings Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            設定
          </h2>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            ユーザー情報
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ユーザー名
              </label>
              <input
                type="text"
                value={currentUser.username}
                onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ユーザーID
              </label>
              <input
                type="text"
                value={currentUser.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Storage Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ストレージ使用状況
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{recordings.length}</div>
                <div className="text-sm text-blue-800">録音ファイル (最大5件)</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{documents.length}</div>
                <div className="text-sm text-green-800">文字起こし文書 (最大15件)</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{getTotalStorageUsage()}</div>
                <div className="text-sm text-purple-800">使用容量 (KB)</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>• 録音ファイルと文書はすべてローカルストレージに保存されます</p>
              <p>• データは外部に送信されることはありません</p>
              <p>• ブラウザのデータを削除すると、すべての録音と文書が失われます</p>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            データ管理
          </h3>
          
          <div className="space-y-6">
            {/* Clear All Data */}
            <div className="border border-warning-200 rounded-lg p-4 bg-warning-50">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h4 className="font-medium text-warning-900">すべてのデータを削除</h4>
                  <p className="text-sm text-warning-700 mt-1">
                    すべての録音ファイルと文字起こし文書を削除します。この操作は取り消せません。
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="mt-3 flex items-center px-3 py-2 bg-warning-600 text-white rounded-md hover:bg-warning-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      データを削除
                    </button>
                  ) : (
                    <div className="mt-3 space-x-2">
                      <button
                        onClick={handleDeleteAllData}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        削除を実行
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
                      >
                        キャンセル
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Deletion */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">アカウント削除</h4>
                  <p className="text-sm text-red-700 mt-1">
                    アカウントとすべてのデータを完全に削除します。この操作は取り消せません。
                  </p>
                  
                  <button
                    onClick={handleAccountDeletion}
                    className="mt-3 flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    <User className="w-4 h-4 mr-2" />
                    アカウントを削除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            アプリケーション情報
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>バージョン:</strong> 1.0.0</p>
            <p><strong>最終更新:</strong> 2025年1月</p>
            <p><strong>対応ブラウザ:</strong> Chrome, Firefox, Safari, Edge</p>
            <p><strong>プライバシー:</strong> すべてのデータはローカルに保存され、外部に送信されません</p>
          </div>
        </div>
      </div>
    </div>
  );
}