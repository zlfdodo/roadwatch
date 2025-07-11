import { formatDateTime, formatRecurringSummary } from '../../utils/helpers';

function EventPanel({ events }) {
  const sortedEvents = [...events].sort((a, b) => {
    const aLat = a.geography?.coordinates?.[0]?.[1] ?? -Infinity;
    const bLat = b.geography?.coordinates?.[0]?.[1] ?? -Infinity;
    return bLat - aLat; // Descending → North to South
  });
  return (
    <section className="event-panel">
      <h3>🛣️ Live Road Events (From North to South)</h3>

      {!events ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No current events.</p>
      ) : (
        <div className="event-table-wrapper">
          <table className="event-table">
            <thead>
              <tr>
                <th>Road Name</th>
                <th>Severity</th>
                <th>From</th>
                <th>To</th>
                <th>Event Type</th>
                <th>Event Subtypes</th>
                <th>Schedule From</th>
                <th>Schedule To</th>
                <th>Recurring Schedule</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map(event => {
                const road = event.roads?.[0] || {};
                let scheduleFrom = '—';
                let scheduleTo = '—';
                let recurringSummary = '—';
                
                if (event.schedule?.intervals?.length > 0) {
                  const [from, to] = event.schedule.intervals[0].split('/');
                  scheduleFrom = formatDateTime(from);
                  scheduleTo = formatDateTime(to);
                } else if (event.schedule?.recurring_schedules?.length > 0) {
                  recurringSummary = formatRecurringSummary(event.schedule.recurring_schedules[0]);
                  const sched = event.schedule.recurring_schedules[0];
                  const from = `${sched.start_date}T${sched.daily_start_time}`;
                  const to = `${sched.end_date}T${sched.daily_end_time}`;
                  scheduleFrom = formatDateTime(from);
                  scheduleTo = formatDateTime(to);
                }

                return (
                  <tr key={event.id}>
                    <td>{road.name ?? '—'}</td>
                    <td>{event.severity ?? '—'}</td>
                    <td>{road.from ?? '—'}</td>
                    <td>{road.to ?? '—'}</td>
                    <td>{event.event_type ?? '—'}</td>
                    <td>{(event.event_subtypes ?? []).join(', ') || '—'}</td>
                    <td>{scheduleFrom}</td>
                    <td>{scheduleTo}</td>
                    <td>{recurringSummary}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default EventPanel;
