import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { InvocationsAreaChart } from './components/InvocationsAreaChart';
import { LatencyLineChart } from './components/LatencyLineChart';
import { StatusCodeDonutChart } from './components/StatusCodeDonutChart';
import { GeoDistribution } from './components/GeoDistribution';
import { ClientAnalyticsTable } from './components/ClientAnalyticsTable';
import { GraphQLModal } from './components/GraphQLModal';
import {
  WORKERS_LIST,
  getKpiMetrics,
  generateTimelineData,
  STATUS_CODES_DATA,
  GEO_DISTRIBUTION_DATA,
  INITIAL_CLIENT_LOGS,
  createRandomLog,
  getMockGraphQLQuerySample,
} from './data/mockData';
import { AutoRefreshRate, ClientConnectionLog, TimeRange, WorkerInfo } from './types';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<WorkerInfo>(WORKERS_LIST[0]);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [autoRefresh, setAutoRefresh] = useState<AutoRefreshRate>(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatusCodeFilter, setSelectedStatusCodeFilter] = useState<number | null>(null);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | null>(null);
  const [isGraphQLModalOpen, setIsGraphQLModalOpen] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const [metrics, setMetrics] = useState(() => getKpiMetrics('24h', WORKERS_LIST[0].id));
  const [timelineData, setTimelineData] = useState(() => generateTimelineData('24h', WORKERS_LIST[0].id));
  const [clientLogs, setClientLogs] = useState<ClientConnectionLog[]>(INITIAL_CLIENT_LOGS);

  useEffect(() => {
    setIsRefreshing(true);
    setMetrics(getKpiMetrics(timeRange, selectedWorker.id));
    setTimelineData(generateTimelineData(timeRange, selectedWorker.id));

    const timer = window.setTimeout(() => setIsRefreshing(false), 200);
    return () => window.clearTimeout(timer);
  }, [timeRange, selectedWorker]);

  useEffect(() => {
    if (autoRefresh === 0) return;

    const interval = window.setInterval(() => {
      setIsRefreshing(true);
      const newLogs = [createRandomLog(), createRandomLog()];

      setClientLogs((prev) => [...newLogs, ...prev.slice(0, 38)]);
      setMetrics((prev) => ({
        ...prev,
        dailyQuotaUsed: Math.min(prev.dailyQuotaMax, prev.dailyQuotaUsed + 2),
        totalInvocations: prev.totalInvocations + 2,
      }));

      window.setTimeout(() => setIsRefreshing(false), 350);
    }, autoRefresh * 1000);

    return () => window.clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    setClientLogs((prev) => [createRandomLog(), ...prev.slice(0, 39)]);
    setMetrics(getKpiMetrics(timeRange, selectedWorker.id));
    setTimelineData(generateTimelineData(timeRange, selectedWorker.id));
    window.setTimeout(() => setIsRefreshing(false), 400);
  }, [timeRange, selectedWorker]);

  const handleTriggerTrafficBurst = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      dailyQuotaUsed: Math.min(prev.dailyQuotaMax, prev.dailyQuotaUsed + 480),
      totalInvocations: prev.totalInvocations + 480,
    }));

    const bursts = Array.from({ length: 4 }, () => createRandomLog());
    setClientLogs((prev) => [...bursts, ...prev.slice(0, 36)]);
    setBannerNotice('Traffic Burst Injected: +480 requests registered across edge isolates.');
    window.setTimeout(() => setBannerNotice(null), 4000);
  }, []);

  const handleSimulateWorkerException = useCallback(() => {
    const errorLog: ClientConnectionLog = {
      id: `err-${Date.now()}`,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      clientIp: '198.51.100.21',
      userAgent: 'Mozilla/5.0 (V8 Isolate Crash Trigger)',
      browser: 'Isolate Crash Simulator',
      device: 'Bot',
      country: 'United States',
      countryCode: 'US',
      method: 'POST',
      path: '/api/v1/heavy/transform',
      statusCode: 1042,
      statusText: 'Worker Exception',
      cpuTimeMs: 10.85,
      rayId: '8ca19fc471b092-SJC',
      colo: 'SJC',
      coloCity: 'San Jose, CA',
      tlsVersion: 'TLSv1.3',
      asn: 'AS13335 Cloudflare',
      cacheStatus: 'DYNAMIC',
    };

    setClientLogs((prev) => [errorLog, ...prev.slice(0, 39)]);
    setSelectedStatusCodeFilter(1042);
    setBannerNotice('Worker Exception 1042 triggered! CPU Limit exceeded 10.0ms.');
    window.setTimeout(() => setBannerNotice(null), 5000);
  }, []);

  const graphQLSample = getMockGraphQLQuerySample(selectedWorker.name);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-[#090d16] text-[#f1f5f9]' : 'bg-[#f8fafc] text-[#0f172a]'
      }`}
    >
      <Header
        workers={WORKERS_LIST}
        selectedWorker={selectedWorker}
        onSelectWorker={setSelectedWorker}
        timeRange={timeRange}
        onChangeTimeRange={setTimeRange}
        autoRefresh={autoRefresh}
        onChangeAutoRefresh={setAutoRefresh}
        isRefreshing={isRefreshing}
        onManualRefresh={handleManualRefresh}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((dark) => !dark)}
        onOpenGraphQLModal={() => setIsGraphQLModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {bannerNotice && (
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs flex items-center justify-between animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{bannerNotice}</span>
            </div>
            <button
              onClick={() => setBannerNotice(null)}
              className="text-orange-400 hover:text-white font-bold ml-3 text-sm"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <KpiSummaryCards metrics={metrics} isDarkMode={isDarkMode} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InvocationsAreaChart data={timelineData} isDarkMode={isDarkMode} />
          <LatencyLineChart data={timelineData} isDarkMode={isDarkMode} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatusCodeDonutChart
            data={STATUS_CODES_DATA}
            isDarkMode={isDarkMode}
            selectedCode={selectedStatusCodeFilter}
            onSelectStatusCode={setSelectedStatusCodeFilter}
          />
          <GeoDistribution
            data={GEO_DISTRIBUTION_DATA}
            isDarkMode={isDarkMode}
            selectedCountry={selectedCountryFilter}
            onSelectCountry={setSelectedCountryFilter}
          />
        </div>

        <ClientAnalyticsTable
          logs={clientLogs}
          isDarkMode={isDarkMode}
          selectedStatusCodeFilter={selectedStatusCodeFilter}
          onClearStatusCodeFilter={() => setSelectedStatusCodeFilter(null)}
          selectedCountryFilter={selectedCountryFilter}
          onClearCountryFilter={() => setSelectedCountryFilter(null)}
        />
      </main>

      <footer
        className={`border-t py-4 text-xs transition-colors ${
          isDarkMode
            ? 'border-slate-800/80 text-slate-500 bg-[#090d16]'
            : 'border-slate-200 text-slate-400 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Cloudflare Workers Isolate Runtime (v8)</span>
            <span className="text-slate-600">·</span>
            <span>Anycast Edge DNS Active</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>
              Daily Free Tier Limit: <strong className="font-mono text-slate-400">100,000 req / day</strong>
            </span>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => setIsGraphQLModalOpen(true)}
              className="text-orange-400 hover:underline font-mono"
            >
              Inspect GraphQL Schema
            </button>
          </div>
        </div>
      </footer>

      <GraphQLModal
        isOpen={isGraphQLModalOpen}
        onClose={() => setIsGraphQLModalOpen(false)}
        sample={graphQLSample}
        isDarkMode={isDarkMode}
        onTriggerTrafficBurst={handleTriggerTrafficBurst}
        onSimulateWorkerException={handleSimulateWorkerException}
      />
    </div>
  );
}
