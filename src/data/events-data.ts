export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  displayDate: string;
  type: 'workshop' | 'conference' | 'meetup';
  price: string;
  status: 'open' | 'closed' | 'coming-soon';
  url: string;
  imageUrl?: string;
}

export const eventsData: Event[] = [
  {
    id: 'otel-collector-workshop-2026-berlin',
    slug: 'otel-collector-workshop-2026-berlin',
    title: 'OpenTelemetry Collector Workshop',
    description: 'Two-day, in-person OpenTelemetry Collector workshop. Master Collector architecture, pipelines, resiliency, security, and production-grade deployment patterns with hands-on labs.',
    location: 'Berlin city-center venue (final location shared with confirmed attendees)',
    city: 'Berlin',
    country: 'Germany',
    startDate: '2026-01-14',
    endDate: '2026-01-15',
    displayDate: 'January 14-15, 2026',
    type: 'workshop',
    price: '€1,970',
    status: 'open',
    url: '/events/2026/01/berlin/otel-collector-workshop',
  },
  {
    id: 'otel-collector-workshop-2025-berlin',
    slug: 'otel-collector-workshop-2025-berlin',
    title: 'OpenTelemetry Collector Workshop',
    description: 'Two-day, in-person OpenTelemetry Collector workshop. Master Collector architecture, pipelines, resiliency, security, and production-grade deployment patterns with hands-on labs.',
    location: 'Berlin, Germany',
    city: 'Berlin',
    country: 'Germany',
    startDate: '2025-10-29',
    endDate: '2025-10-30',
    displayDate: 'October 29-30, 2025',
    type: 'workshop',
    price: '€1,970',
    status: 'closed',
    url: '/events/2025/10/berlin/otel-collector-workshop',
  },
];

// Helper functions
export function getEventBySlug(slug: string): Event | undefined {
  return eventsData.find(event => event.slug === slug);
}

export function getUpcomingEvents(): Event[] {
  return eventsData.filter(event => event.status !== 'closed').sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });
}

export function getAllEvents(): Event[] {
  return eventsData.sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
}

export function getEventsByStatus(status: 'open' | 'closed' | 'coming-soon'): Event[] {
  return eventsData.filter(event => event.status === status);
}
