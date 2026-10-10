import React, { useState } from 'react';
import CyclePhaseCard from './CyclePhaseCard';
import CycleCalendar from './CycleCalendar';
import WellbeingInsights from './WellbeingInsights';
import CycleHistoryList from './CycleHistoryList';
import SymptomLoggerModal from './SymptomLoggerModal';
import CycleSettingsModal from './CycleSettingsModal';
import PrintableReportModal from './PrintableReportModal';
import './PeriodTrackerView.css';

export default function PeriodTrackerView() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDateForLog, setSelectedDateForLog] = useState(new Date());

  const handleOpenLogForDate = (date) => {
    setSelectedDateForLog(date || new Date());
    setIsLogModalOpen(true);
  };

  return (
    <div className="module-view app-container">
      {/* 1. Cycle Phase & Countdown Hero Card */}
      <CyclePhaseCard
        onOpenLogModal={handleOpenLogForDate}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* 2. Interactive Monthly Cycle Calendar & Phase Insights */}
      <div className="grid-2">
        <CycleCalendar onSelectDate={handleOpenLogForDate} />
        <WellbeingInsights />
      </div>

      {/* 3. Cycle History & Variation Analysis */}
      <CycleHistoryList onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />

      {/* Modals */}
      <SymptomLoggerModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        initialDate={selectedDateForLog}
      />

      <CycleSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <PrintableReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
