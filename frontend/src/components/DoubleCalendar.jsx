import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DoubleCalendar = ({ 
  occupiedRanges = [], 
  selectedStart = null, 
  selectedEnd = null, 
  onRangeSelect = null, 
  readOnly = false 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Get next month and year
  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;

  const monthsInfo = [
    { y: year, m: month },
    { y: nextMonthYear, m: nextMonth }
  ];

  const handlePrevMonths = () => {
    // Prevent going past current month/year
    const today = new Date();
    const target = new Date(year, month - 1, 1);
    if (target.getFullYear() < today.getFullYear() || 
       (target.getFullYear() === today.getFullYear() && target.getMonth() < today.getMonth())) {
      return;
    }
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonths = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    const day = new Date(y, m, 1).getDay(); // 0 = Sunday, 1 = Monday...
    // Adjust so 0 = Monday, 6 = Sunday for Spanish style calendars
    return day === 0 ? 6 : day - 1;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekdayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  const formatDate = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Checks if a date string falls inside any occupied ranges
  const isOccupied = (dateStr) => {
    const targetDate = new Date(dateStr + 'T00:00:00');
    return occupiedRanges.some(range => {
      const start = new Date(range.startDate + 'T00:00:00');
      const end = new Date(range.endDate + 'T00:00:00');
      return targetDate >= start && targetDate <= end;
    });
  };

  const isPast = (y, m, d) => {
    const target = new Date(y, m, d, 23, 59, 59);
    return target < new Date();
  };

  const handleDayClick = (y, m, d) => {
    if (readOnly || isPast(y, m, d)) return;
    const dateStr = formatDate(y, m, d);
    if (isOccupied(dateStr)) return; // occupied dates cannot be selected

    if (!onRangeSelect) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      onRangeSelect(dateStr, null);
    } else {
      const start = new Date(selectedStart + 'T00:00:00');
      const end = new Date(dateStr + 'T00:00:00');
      if (end < start) {
        onRangeSelect(dateStr, null);
      } else {
        // Validate that no occupied dates are within the chosen range
        let hasOccupiedInRange = false;
        let current = new Date(start);
        while (current <= end) {
          const checkY = current.getFullYear();
          const checkM = current.getMonth();
          const checkD = current.getDate();
          if (isOccupied(formatDate(checkY, checkM, checkD))) {
            hasOccupiedInRange = true;
            break;
          }
          current.setDate(current.getDate() + 1);
        }

        if (hasOccupiedInRange) {
          // Reset selection to clicked day
          onRangeSelect(dateStr, null);
        } else {
          onRangeSelect(selectedStart, dateStr);
        }
      }
    }
  };

  const isSelected = (dateStr) => {
    if (selectedStart === dateStr) return 'start';
    if (selectedEnd === dateStr) return 'end';
    if (selectedStart && selectedEnd) {
      const d = new Date(dateStr + 'T00:00:00');
      const s = new Date(selectedStart + 'T00:00:00');
      const e = new Date(selectedEnd + 'T00:00:00');
      if (d > s && d < e) return 'range';
    }
    return null;
  };

  return (
    <div className="double-calendar" style={{
      backgroundColor: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      maxWidth: '750px',
      width: '100%'
    }}>
      {/* Calendar Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={handlePrevMonths} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '18px', fontWeight: 700 }}>
          {monthNames[month]} {year} - {monthNames[nextMonth]} {nextMonthYear}
        </h3>
        <button 
          onClick={handleNextMonths} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Double Month Grids */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        {monthsInfo.map(({ y, m }, monthIndex) => {
          const daysInMonth = getDaysInMonth(y, m);
          const firstDayOffset = getFirstDayOfMonth(y, m);

          // Build empty slots for the first week offset
          const blanks = Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`blank-${i}`} style={{ width: '100%', height: '36px' }}></div>
          ));

          // Build day cells
          const dayCells = Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const dateStr = formatDate(y, m, d);
            const occupied = isOccupied(dateStr);
            const past = isPast(y, m, d);
            const selState = isSelected(dateStr);

            let dayStyle = {
              width: '100%',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease',
              margin: '2px 0'
            };

            let titleLabel = `${d} de ${monthNames[m]}`;

            if (past) {
              dayStyle.color = 'var(--text-light)';
              dayStyle.cursor = 'not-allowed';
              dayStyle.textDecoration = 'line-through';
            } else if (occupied) {
              dayStyle.backgroundColor = '#FFEBEE';
              dayStyle.color = 'var(--error-color)';
              dayStyle.textDecoration = 'line-through';
              dayStyle.cursor = 'not-allowed';
              titleLabel += ' (Ocupado)';
            } else if (selState === 'start' || selState === 'end') {
              dayStyle.backgroundColor = 'var(--accent-color)';
              dayStyle.color = 'var(--white)';
              dayStyle.borderRadius = '50%';
            } else if (selState === 'range') {
              dayStyle.backgroundColor = 'rgba(29, 190, 180, 0.15)';
              dayStyle.color = 'var(--accent-color)';
              dayStyle.borderRadius = '0';
            } else {
              dayStyle.color = 'var(--primary-color)';
              dayStyle.backgroundColor = 'transparent';
              // Hover classes styled via JS hover simulation or inline style rules
            }

            return (
              <div 
                key={`day-${d}`} 
                style={dayStyle}
                title={titleLabel}
                onClick={() => handleDayClick(y, m, d)}
                onMouseEnter={(e) => {
                  if (!past && !occupied && selState !== 'start' && selState !== 'end') {
                    e.currentTarget.style.backgroundColor = '#E0F2F1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!past && !occupied && selState !== 'start' && selState !== 'end' && selState !== 'range') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  } else if (selState === 'range') {
                    e.currentTarget.style.backgroundColor = 'rgba(29, 190, 180, 0.15)';
                  }
                }}
              >
                {d}
              </div>
            );
          });

          return (
            <div key={`${y}-${m}`} style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '12px', fontSize: '15px' }}>
                {monthNames[m]} {y}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                textAlign: 'center',
                gap: '4px'
              }}>
                {weekdayNames.map(wd => (
                  <div key={wd} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-medium)', paddingBottom: '6px' }}>
                    {wd}
                  </div>
                ))}
                {blanks}
                {dayCells}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic legend */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: '12px', borderTop: '1px solid var(--border)', paddingTop: '14px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid var(--border)' }}></div>
          <span>Disponible</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFEBEE', textDecoration: 'line-through' }}></div>
          <span style={{ color: 'var(--error-color)', fontWeight: 600 }}>Ocupado (Reservado)</span>
        </div>
        {!readOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }}></div>
            <span>Tu selección</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubleCalendar;
