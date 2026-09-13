import React, { useState } from 'react';
import { Upload, Download, RotateCcw, CheckCircle2, AlertTriangle, FileText, Database } from 'lucide-react';
import { exportUserData, importUserData, storage } from '../../utils/dataManager';

export default function QuestionImporter() {
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState(null); // { success: boolean, message: string }

  // Custom question import
  function handleImportCustomQuestions() {
    try {
      const parsed = JSON.parse(jsonInput);
      const arr = Array.isArray(parsed) ? parsed : [parsed];

      // Simple validation
      const valid = arr.filter(q => q.question && Array.isArray(q.options) && typeof q.answerIndex === 'number');
      if (valid.length === 0) {
        setImportStatus({ success: false, message: 'No valid questions found in JSON. Required: question, options (array of 5), answerIndex.' });
        return;
      }

      const existing = storage.get('bq_custom_questions_v1', []);
      const merged = [...valid, ...existing];
      storage.set('bq_custom_questions_v1', merged);

      setImportStatus({ success: true, message: `Successfully imported ${valid.length} custom questions!` });
      setJsonInput('');
    } catch (e) {
      setImportStatus({ success: false, message: `JSON Parse Error: ${e.message}` });
    }
  }

  // Backup export
  function handleExportBackup() {
    const data = exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank-quant-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Backup restore
  function handleRestoreBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const ok = importUserData(json);
        if (ok) {
          alert('Backup restored successfully! The page will now reload.');
          window.location.reload();
        } else {
          alert('Failed to restore backup: invalid data structure.');
        }
      } catch (err) {
        alert(`Error reading backup file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
          <Database className="w-4 h-4" />
          <span>Data Management & Custom Content</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          Question Importer & Backup Center
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Import your own custom questions or backup and restore your preparation progress, mistakes, and bookmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Question Importer */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Import Custom Questions (JSON)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Paste a JSON array of custom question objects with question, options, answerIndex, and topperMethod.
          </p>

          <textarea
            rows={8}
            placeholder={`[\n  {\n    "topic": "simplification",\n    "question": "45 × 8 − 120 ÷ 4 = ?",\n    "options": ["330", "345", "350", "360", "325"],\n    "answerIndex": 0\n  }\n]`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
          />

          {importStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              importStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            }`}>
              {importStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{importStatus.message}</span>
            </div>
          )}

          <button
            onClick={handleImportCustomQuestions}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            Validate & Import to Bank
          </button>
        </div>

        {/* Backup & Restore */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Backup & Restore Profile</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export your complete study data (attempt history, mistake notebook, bookmarks, and topic notes) to transfer between devices.
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup JSON File</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Restore from Existing Backup:
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreBackup}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
