import { useCallback, useEffect, useRef, useState } from 'react';
import { mockApplications, mockActivityLog } from '../data/mockData';

export function useApplicationsData() {
  const [applications, setApplications] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [dataSource, setDataSource] = useState('demo');
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [status, setStatus] = useState('idle');

  const abortRef = useRef(null);

  const scriptUrl =
    import.meta.env.VITE_AFTERAPPLY_APPS_SCRIPT_URL ||
    import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  const load = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    abortRef.current = new AbortController();

    setRefreshing(true);
    setError(null);

    try {
      if (!scriptUrl) {
        setApplications(mockApplications);
        setActivityLog(mockActivityLog);
        setDataSource('demo');
        setLastSyncedAt(null);
        setInitialLoadComplete(true);
        setStatus('ready');
        return;
      }

      setStatus('loading');

      const response = await fetch(scriptUrl, {
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch live data: ${response.status}`);
      }

      const payload = await response.json();

      if (!payload.ok) {
        throw new Error(payload.error || 'Apps Script returned an error');
      }

      setApplications(payload.applications || []);
      setActivityLog(payload.activityLog || []);
      setDataSource('live');
      setLastSyncedAt(payload.generatedAt || new Date().toISOString());
      setInitialLoadComplete(true);
      setStatus('ready');
    } catch (err) {
      if (err.name === 'AbortError') return;

      setApplications(mockApplications);
      setActivityLog(mockActivityLog);
      setDataSource('fallback');
      setError(err.message);
      setInitialLoadComplete(true);
      setStatus('ready');
    } finally {
      setRefreshing(false);
    }
  }, [scriptUrl]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  const showBlockingLoader =
    !!scriptUrl && !initialLoadComplete && status === 'loading';

  return {
    applications,
    activityLog,
    dataSource,
    error,
    lastSyncedAt,
    refreshing,
    showBlockingLoader,
    refresh: load,
  };
}