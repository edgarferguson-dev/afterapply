import { useCallback, useEffect, useRef, useState } from "react";
import { appsScriptUrl } from "../config/dataSource";
import { fetchSheetData } from "../api/fetchSheetData";
import { applications as mockApplications, activityLog as mockActivityLog } from "../data/mockData";

export function useApplicationsData() {
  const [applications, setApplications] = useState(() =>
    appsScriptUrl ? [] : mockApplications
  );
  const [activityLog, setActivityLog] = useState(mockActivityLog);
  const [status, setStatus] = useState(() => (appsScriptUrl ? "loading" : "ready"));
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(() => !appsScriptUrl);
  const [dataSource, setDataSource] = useState(() => (appsScriptUrl ? "pending" : "mock"));
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const abortRef = useRef(null);
  const firstFetchDoneRef = useRef(!appsScriptUrl);

  const load = useCallback(async () => {
    if (!appsScriptUrl) {
      setApplications(mockApplications);
      setActivityLog(mockActivityLog);
      setDataSource("mock");
      setStatus("ready");
      setError(null);
      setLastSyncedAt(null);
      setInitialLoadComplete(true);
      firstFetchDoneRef.current = true;
      setRefreshing(false);
      return;
    }

    const isFirstFetch = !firstFetchDoneRef.current;
    if (isFirstFetch) {
      setStatus("loading");
    } else {
      setRefreshing(true);
    }
    setError(null);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const { applications: next, activityLog: nextLog, generatedAt } =
        await fetchSheetData(appsScriptUrl, ac.signal);

      setApplications(next);
      setActivityLog(nextLog && nextLog.length > 0 ? nextLog : []);
      setDataSource("live");
      setLastSyncedAt(generatedAt ? new Date(generatedAt) : new Date());
    } catch (e) {
      if (e?.name !== "AbortError") {
        setApplications(mockApplications);
        setActivityLog(mockActivityLog);
        setDataSource("fallback");
        setLastSyncedAt(null);
        setError(e instanceof Error ? e.message : "Could not load sheet data");
      }
    } finally {
      if (!ac.signal.aborted) {
        firstFetchDoneRef.current = true;
        setInitialLoadComplete(true);
        setStatus("ready");
      }
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  const showBlockingLoader = appsScriptUrl && !initialLoadComplete && status === "loading";

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
