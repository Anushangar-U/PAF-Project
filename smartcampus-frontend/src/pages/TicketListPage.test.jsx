import { render, screen, waitFor } from '@testing-library/react';
import TicketListPage from './TicketListPage';
import ticketService from '../services/TicketService';

jest.mock('../services/TicketService', () => ({
  __esModule: true,
  default: {
    getAllTickets: jest.fn(),
  },
}));

describe('TicketListPage', () => {
  it('renders backend tickets when API returns data', async () => {
    ticketService.getAllTickets.mockResolvedValueOnce({
      data: [
        {
          id: 11,
          title: 'Projector issue in Room 12',
          description: 'Projector does not start',
          location: 'Room 12',
          category: 'IT_EQUIPMENT',
          priority: 'HIGH',
          status: 'OPEN',
          createdAt: '2026-04-16T10:00:00.000Z',
          reportedBy: { name: 'Student One' },
          attachmentUrls: [],
        },
      ],
    });

    render(<TicketListPage onSelect={jest.fn()} refreshKey={0} />);

    await waitFor(() => {
      expect(screen.getByText('Projector issue in Room 12')).toBeInTheDocument();
    });
    expect(ticketService.getAllTickets).toHaveBeenCalledTimes(1);
  });

  it('falls back to demo tickets when API fails', async () => {
    ticketService.getAllTickets.mockRejectedValueOnce(new Error('network error'));

    render(<TicketListPage onSelect={jest.fn()} refreshKey={0} />);

    await waitFor(() => {
      expect(screen.getByText(/AC not working in Lab 4/i)).toBeInTheDocument();
    });
    expect(ticketService.getAllTickets).toHaveBeenCalledTimes(1);
  });
});
