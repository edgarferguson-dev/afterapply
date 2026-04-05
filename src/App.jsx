import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import ActivityStrip from "./components/ActivityStrip";
import NeedsAttention from "./components/NeedsAttention";
import ApplicationList from "./components/ApplicationList";
import DataSyncStatus from "./components/DataSyncStatus";
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
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header stats={stats} />

      <DataSyncStatus
        dataSource={dataSource}
        error={error}
        lastSyncedAt={lastSyncedAt}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        {showBlockingLoader ? (
          <LoadingApplications />
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {dataSource === "live" && applications.length === 0 && (
              <LiveSheetEmpty />
            )}
            <SummaryCards applications={applications} />
            <ActivityStrip stats={stats} activityLog={activityLog} />
            <NeedsAttention applications={applications} />
            <ApplicationList applications={applications} />
          </div>
        )}
      </main>

      <footer className="border-t border-surface-subtle py-3">
        <p className="text-center text-[10px] text-tertiary tracking-wide">
          AfterApply — Built for job seekers who want a system.
        </p>
      </footer>
    </div>
  );
}
