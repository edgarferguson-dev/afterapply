import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import ActivityStrip from "./components/ActivityStrip";
import NeedsAttention from "./components/NeedsAttention";
import ApplicationList from "./components/ApplicationList";
import SyncStatusBar from "./components/SyncStatusBar";
import LiveSheetEmpty from "./components/LiveSheetEmpty";
import LoadingApplications from "./components/LoadingApplications";
import { useApplicationsData } from "./hooks/useApplicationsData";
import { getPipelineStats } from "./utils/helpers";

export default function App() {
  const {
    applications,
    activityLog,
    dataSource,
    error,
    lastSyncedAt,
    refreshing,
    showBlockingLoader,
    refresh,
  } = useApplicationsData();

  const stats = getPipelineStats(applications);

  return (
    <div className="app-shell flex min-h-screen flex-col text-[color:var(--text-primary)]">
      <Header stats={stats} />

      <SyncStatusBar
        dataSource={dataSource}
        error={error}
        lastSyncedAt={lastSyncedAt}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      <main className="mx-auto w-full max-w-[84rem] flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        {showBlockingLoader ? (
          <LoadingApplications />
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {dataSource === "live" && applications.length === 0 && (
              <LiveSheetEmpty />
            )}
            <div className="grid gap-4 xl:grid-cols-[1.45fr_minmax(20rem,0.92fr)] xl:items-start">
              <div className="space-y-4">
                <SummaryCards applications={applications} stats={stats} />
                <ActivityStrip stats={stats} activityLog={activityLog} />
                <ApplicationList applications={applications} />
              </div>
              <NeedsAttention applications={applications} />
            </div>
          </div>
        )}
      </main>

      <footer className="footer-line py-4">
        <p className="text-center text-[10px] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
          AfterApply - Built for job seekers who want a system.
        </p>
      </footer>
    </div>
  );
}


