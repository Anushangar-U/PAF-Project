import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TicketForm from './TicketForm';
import ticketService from '../../services/TicketService';

jest.mock('./AttachmentUploader', () => {
  return function MockAttachmentUploader() {
    return <div data-testid="attachment-uploader" />;
  };
});

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      id: 42,
      name: 'Test User',
      email: 'test.user@campus.edu',
    },
  }),
}));

jest.mock('../../services/TicketService', () => ({
  __esModule: true,
  default: {
    createTicket: jest.fn(),
  },
}));

describe('TicketForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validates required fields before submitting', async () => {
    const onCreated = jest.fn();

    render(<TicketForm onClose={jest.fn()} onCreated={onCreated} />);

    fireEvent.click(screen.getByRole('button', { name: /submit ticket/i }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Location is required')).toBeInTheDocument();
    expect(screen.getByText('Please select a category')).toBeInTheDocument();
    expect(ticketService.createTicket).not.toHaveBeenCalled();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it('submits form data and returns created ticket', async () => {
    const onCreated = jest.fn();
    const createdTicket = { id: 'T-100', title: 'Projector issue' };

    ticketService.createTicket.mockResolvedValueOnce({ data: createdTicket });

    render(<TicketForm onClose={jest.fn()} onCreated={onCreated} />);

    fireEvent.change(document.getElementById('ticket-title'), {
      target: { value: 'Projector issue' },
    });
    fireEvent.change(document.getElementById('ticket-description'), {
      target: { value: 'Projector does not power on in Lab 2' },
    });
    fireEvent.change(document.getElementById('ticket-location'), {
      target: { value: 'Lab 2' },
    });
    fireEvent.change(document.getElementById('ticket-category'), {
      target: { value: 'IT_EQUIPMENT' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit ticket/i }));

    await waitFor(() => {
      expect(ticketService.createTicket).toHaveBeenCalledTimes(1);
      expect(onCreated).toHaveBeenCalledWith(createdTicket);
    });

    const submittedForm = ticketService.createTicket.mock.calls[0][0];
    expect(submittedForm).toBeInstanceOf(FormData);
    expect(submittedForm.get('title')).toBe('Projector issue');
    expect(submittedForm.get('category')).toBe('IT_EQUIPMENT');
    expect(submittedForm.get('reportedById')).toBe('42');
  });
});
