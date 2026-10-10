import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles,
  Info
} from 'lucide-react';
import { useCycle } from '../../context/CycleContext';
import { 
  formatDateISO, 
  normalizeDate, 
  addDays, 
  getDaysDifference 
} from '../../utils/cycleCalculations';
import './CycleCalendar.css';

export default function CycleCalendar({ onSelectDate }) {
  const { metrics, settings, symptomLogs, cycleHistory } = useCycle();
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const jumpToToday = () => {
    setCurrentMonthDate(new Date());
  };

  // Build 35 or 42 grid day cells for current calendar month view
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startWeekday = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon...
    const daysInMonth = lastDayOfMonth.getDate();

    const cells = [];

    // Previous month padding
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDate - i);
      cells.push({
        date: d,
        iso: formatDateISO(d),
        dayNumber: d.getDate(),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      cells.push({
        date: d,
        iso: formatDateISO(d),
        dayNumber: day,
        isCurrentMonth: true
      });
    }

    // Next month padding to fill out 35 or 42 cells (7-day rows)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      cells.push({
        date: d,
        iso: formatDateISO(d),
        dayNumber: day,
        isCurrentMonth: false
      });
    }

    return cells;
  }, [year, month]);

  const todayIso = formatDateISO(new Date());

  // Determine status for each calendar day
  const getDayStatus = (cell) => {
    const iso = cell.iso;
    const isToday = iso === todayIso;

    // Check if symptoms logged
    const hasSymptom = symptomLogs.some((l) => l.date === iso);

    // Check if within logged period bleeding duration
    let isPeriod = false;
    if (settings.lastPeriodStart) {
      const diffFromLastStart = getDaysDifference(settings.lastPeriodStart, iso);
      if (diffFromLastStart >= 0 && diffFromLastStart < (settings.periodDuration || 5)) {
        isPeriod = true;
      }
    }

    // Check history period logs
    cycleHistory.forEach((hist) => {
      const diff = getDaysDifference(hist.startDate, iso);
      if (diff >= 0 && diff < (settings.periodDuration || 5)) {
        isPeriod = true;
      }
    });

    // Check predicted next period
    let isPredictedPeriod = false;
    if (metrics.nextPeriodStart) {
      const diffFromNextStart = getDaysDifference(metrics.nextPeriodStart, iso);
      if (diffFromNextStart >= 0 && diffFromNextStart < (settings.periodDuration || 5)) {
        isPredictedPeriod = true;
      }
    }

    // Check estimated fertile window and ovulation day
    let isFertile = false;
    let isOvulation = false;
    if (metrics.fertileWindowStart && metrics.fertileWindowEnd) {
      const diffStart = getDaysDifference(metrics.fertileWindowStart, iso);
      const diffEnd = getDaysDifference(iso, metrics.fertileWindowEnd);
      if (diffStart >= 0 && diffEnd >= 0) {
        isFertile = true;
      }
    }
    if (metrics.ovulationDate && formatDateISO(metrics.ovulationDate) === iso) {
      isOvulation = true;
    }

    return {
      isToday,
      hasSymptom,
      isPeriod,
      isPredictedPeriod,
      isFertile,
      isOvulation
    };
  };

  return (
    <section className="glass-card cycle-calendar-container" aria-label="Menstrual Cycle Calendar">
      {/* Calendar Header */}
      <div className="calendar-header">
        <div className="calendar-title-group">
          <CalendarIcon size={20} color="var(--accent-primary)" />
          <h2 className="calendar-month-title">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="calendar-nav-buttons">
          <button 
            className="btn btn-outline" 
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={jumpToToday}
          >
            Today
          </button>
          <button 
            className="btn btn-outline btn-icon" 
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="btn btn-outline btn-icon" 
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="calendar-weekday-header">
            {day}
          </div>
        ))}

        {/* Day Cells */}
        {calendarCells.map((cell) => {
          const status = getDayStatus(cell);
          let cellClasses = ['calendar-day-cell'];
          if (!cell.isCurrentMonth) cellClasses.push('other-month');
          if (status.isToday) cellClasses.push('is-today');
          if (status.isPeriod) cellClasses.push('is-period');
          else if (status.isPredictedPeriod) cellClasses.push('is-predicted-period');
          else if (status.isOvulation) cellClasses.push('is-ovulation');
          else if (status.isFertile) cellClasses.push('is-fertile');

          return (
            <div
              key={cell.iso}
              className={cellClasses.join(' ')}
              onClick={() => onSelectDate(cell.date)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectDate(cell.date);
                }
              }}
              aria-label={`${cell.dayNumber} ${monthNames[month]} ${year}. Click to log symptoms.`}
            >
              <span className="day-number">{cell.dayNumber}</span>
              <div className="day-indicators">
                {status.hasSymptom && <span className="dot-symptom" title="Symptoms logged" />}
                {status.isPeriod && <span className="dot-flow" title="Period flow" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend & Disclaimer Notice */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-swatch swatch-period" />
          <span>Period Days</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch swatch-predicted" />
          <span>Predicted Period (Est.)</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch swatch-fertile" />
          <span>Fertile Window (Est.)</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch swatch-symptom" />
          <span>Symptoms Logged</span>
        </div>
      </div>
    </section>
  );
}
