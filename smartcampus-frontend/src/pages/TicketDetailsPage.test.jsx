import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TicketDetailsPage from './TicketDetailsPage';
import ticketService from '../services/TicketService';
import commentService from '../services/commentService';

jest.mock('../components/comments/CommentList', () => {
  return function MockCommentList() {
    return <div>MockCommentList</div>;
  };
});

jest.mock('../components/technician/TechnicianPanel', () => {
  return function MockTechnicianPanel() {
    return <div>MockTechnicianPanel</div>;
  };
});

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isStaff: true }),
}));

jest.mock('../services/TicketService', () => ({
  __esModule: true,
  default: {
    getTicketById: jest.fn(),
    deleteTicket: jest.fn(),
  },
}));

jest.mock('../services/commentService', () => ({
  __esModule: true,
  default: {
    getCommentsByTicket: jest.fn(),
  },
}));

const initialTicket = {
  id: 1,
  title: 'Network outage in Lab 3',
  description: 'Switch is offline for two hours',
  location: 'Lab 3',
  category: 'IT_EQUIPMENT',
  priority: 'HIGH',
  status: 'OPEN',
  createdAt: '2026-04-16T08:00:00.000Z',
  reportedBy: { name: 'User One', email: 'user@campus.edu' },
  comments: [],
  attachmentUrls: [],
};

describe('TicketDetailsPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('deletes ticket and triggers back callback when confirmed', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    ticketService.getTicketById.mockResolvedValueOnce({ data: initialTicket });
    commentService.getCommentsByTicket.mockResolvedValueOnce({ data: [] });
    ticketService.deleteTicket.mockResolvedValueOnce({});

    const onBack = jest.fn();

    render(<TicketDetailsPage ticket={initialTicket} onBack={onBack} />);

    await waitFor(() => {
      expect(ticketService.getTicketById).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByRole('button', { name: /delete ticket/i }));

    await waitFor(() => {
      expect(ticketService.deleteTicket).toHaveBeenCalledWith(1);
    });

    expect(onBack).toHaveBeenCalledWith(true);
  });

  it('does not call delete when user cancels confirmation', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    ticketService.getTicketById.mockResolvedValueOnce({ data: initialTicket });
    commentService.getCommentsByTicket.mockResolvedValueOnce({ data: [] });

    const onBack = jest.fn();

    render(<TicketDetailsPage ticket={initialTicket} onBack={onBack} />);

    await waitFor(() => {
      expect(ticketService.getTicketById).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByRole('button', { name: /delete ticket/i }));

    expect(ticketService.deleteTicket).not.toHaveBeenCalled();
    expect(onBack).not.toHaveBeenCalledWith(true);
  });
});
