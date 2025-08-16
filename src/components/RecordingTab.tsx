import React, { useState } from 'react';
import { Play, Pause, Square, Trash2, Edit3, Check, X } from 'lucide-react';
import { Recording } from '../types';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { formatTime, formatDate } from '../utils/formatTime';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function RecordingTab() {
  const [recordings, setRecordings] = useLocalStorage<Recording[]>('recordings', []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleSaveRecording = () => {
    if (audioBlob && recordings.length < 5) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const newRecording: Recording = {
        id: Date.now().toString(),
        name: `録音${recordings.length + 1}`,
        date: formatDate(new Date()),
        duration: recordingTime,
        audioBlob,
        audioUrl,
      };
      
      setRecordings([...recordings, newRecording]);
      resetRecording();
    }
  };

  const handleDeleteRecording = (id: string) => {
    if (confirm('この録音を削除しますか？')) {
      const recordingToDelete = recordings.find(r => r.id === id);
      if (recordingToDelete) {
        URL.revokeObjectURL(recordingToDelete.audioUrl);
      }
      setRecordings(recordings.filter(r => r.id !== id));
      if (playingId === id) {
        setPlayingId(null);
      }
    }
  };

  const handleEditName = (recording: Recording) => {
    setEditingId(recording.id);
    setEditingName(recording.name);
  };

  const handleSaveName = () => {
    if (editingId && editingName.trim()) {
      setRecordings(recordings.map(r => 
        r.id === editingId ? { ...r, name: editingName.trim() } : r
      ));
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const togglePlayback = (recording: Recording) => {
    if (playingId === recording.id) {
      setPlayingId(null);
    } else {
      setPlayingId(recording.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Recording Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">録音</h2>
          
          <div className="text-center space-y-6">
            {/* Recording Timer */}
            <div className="text-4xl font-mono text-gray-900">
              {formatTime(recordingTime)}
            </div>
            
            {/* Recording Status */}
            {isRecording && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-recording"></div>
                <span className="text-red-600 font-medium">
                  {isPaused ? '一時停止中' : '録音中'}
                </span>
              </div>
            )}
            
            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={recordings.length >= 5}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  録音開始
                </button>
              ) : (
                <>
                  {!isPaused ? (
                    <button
                      onClick={pauseRecording}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      一時停止
                    </button>
                  ) : (
                    <button
                      onClick={resumeRecording}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      再開
                    </button>
                  )}
                  
                  <button
                    onClick={stopRecording}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    停止
                  </button>
                </>
              )}
            </div>
            
            {/* Save Button */}
            {audioBlob && !isRecording && (
              <button
                onClick={handleSaveRecording}
                disabled={recordings.length >= 5}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                録音を保存
              </button>
            )}
            
            {/* Storage Warning */}
            {recordings.length >= 5 && (
              <p className="text-warning-600 text-sm">
                ⚠️ 録音は最大5件まで保存できます。新しい録音を保存するには、既存の録音を削除してください。
              </p>
            )}
          </div>
        </div>

        {/* Recordings List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            保存済み録音 ({recordings.length}/5)
          </h3>
          
          {recordings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">録音がありません</p>
          ) : (
            <div className="space-y-4">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingId === recording.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                          />
                          <button
                            onClick={handleSaveName}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{recording.name}</h4>
                          <button
                            onClick={() => handleEditName(recording)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {recording.date} • {formatTime(recording.duration)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => togglePlayback(recording)}
                        className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecording(recording.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Audio Player */}
                  {playingId === recording.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <audio
                        controls
                        src={recording.audioUrl}
                        className="w-full"
                        onEnded={() => setPlayingId(null)}
                      />
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