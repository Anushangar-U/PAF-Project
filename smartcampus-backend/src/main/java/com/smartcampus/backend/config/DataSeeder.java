package com.smartcampus.backend.config;

import com.smartcampus.backend.entity.*;
import com.smartcampus.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * DataSeeder – populates MongoDB with demo data on every startup.
 *
 * Seeds:
 *  • 3 users  (USER, TECHNICIAN, ADMIN)
 *  • 5 tickets in various statuses
 *  • 4 comments across tickets
 *  • 8 resources (facilities & assets)
 *
 * Mirrors the frontend DEMO_USERS / DEMO_TICKETS constants so the
 * React UI shows real data without manual Postman calls.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository    userRepository;
    private final TicketRepository  ticketRepository;
    private final CommentRepository commentRepository;
    private final ResourceRepository resourceRepository;

    public DataSeeder(UserRepository userRepository,
                      TicketRepository ticketRepository,
                      CommentRepository commentRepository,
                      ResourceRepository resourceRepository) {
        this.userRepository    = userRepository;
        this.ticketRepository  = ticketRepository;
        this.commentRepository = commentRepository;
        this.resourceRepository = resourceRepository;
    }

    @Override
    public void run(String... args) {

        // Prevent duplicate demo records when the app restarts.
        if (ticketRepository.count() > 0 || commentRepository.count() > 0 || resourceRepository.count() > 0) {
            System.out.println("Demo data already exists. Skipping DataSeeder.");
            return;
        }

        // ── 1. Seed Users ─────────────────────────────────────
        User ali   = createUser("Ali Hassan",  "ali@campus.edu",   UserRole.USER);
        User sara  = createUser("Sara Khan",   "sara@campus.edu",  UserRole.TECHNICIAN);
        createUser("Admin User",  "admin@campus.edu", UserRole.ADMIN);

        // ── 2. Seed Tickets ───────────────────────────────────
        Ticket t1 = createTicket(
            "AC not working in Lab 4",
            "The air conditioning unit in Engineering Lab 4 has been non-functional since Monday.",
            "Engineering Lab 4", Category.HVAC, Priority.HIGH, TicketStatus.OPEN,
            ali, null, null
        );

        Ticket t2 = createTicket(
            "Projector bulb burnt out",
            "The projector in Auditorium B has a blown bulb, making it unusable for lectures.",
            "Auditorium B", Category.IT_EQUIPMENT, Priority.MEDIUM, TicketStatus.IN_PROGRESS,
            ali, sara.getName(), null
        );

        Ticket t3 = createTicket(
            "Water leak near canteen sink",
            "A slow leak under the kitchen sink caused water to pool on the floor.",
            "Main Canteen", Category.PLUMBING, Priority.HIGH, TicketStatus.RESOLVED,
            ali, "Usman Plumber", "Washer replaced and pipe re-sealed. Area declared safe."
        );

        createTicket(
            "Broken door lock – Room 201",
            "The electronic lock on Room 201 is malfunctioning – staff cannot access the room.",
            "Room 201", Category.STRUCTURAL, Priority.MEDIUM, TicketStatus.OPEN,
            ali, null, null
        );

        createTicket(
            "Power socket sparking in Library",
            "A wall socket near reading table 5 sparked when a laptop was plugged in.",
            "Central Library", Category.ELECTRICAL, Priority.HIGH, TicketStatus.CLOSED,
            ali, "Maintenance Team", "Socket replaced. Area declared safe."
        );

        // ── 3. Seed Comments ──────────────────────────────────
        addComment(t1, "Admin User",  "ADMIN",
            "Logged and forwarded to HVAC maintenance team. Expected fix: 2 days.");
        addComment(t2, sara.getName(), "TECHNICIAN",
            "Replacement bulb ordered. Will install once delivered.");
        addComment(t2, "Ali Hassan", "USER",
            "Please expedite – exam hall sessions are affected.");
        addComment(t3, sara.getName(), "TECHNICIAN",
            "All clear. Ticket can be closed.");

        // ── 4. Seed Resources (Facilities) ─────────────────────
        createResource("Engineering Lab 4", "LABORATORY", 40, "Building A, 4th Floor", "09:00-17:00", "AVAILABLE");
        createResource("Auditorium B", "AUDITORIUM", 500, "Main Building, Ground Floor", "08:00-20:00", "AVAILABLE");
        createResource("Main Canteen", "CAFETERIA", 300, "Ground Floor, Central Block", "06:00-22:00", "AVAILABLE");
        createResource("Room 201", "CLASSROOM", 50, "Building B, 2nd Floor", "08:00-17:00", "MAINTENANCE");
        createResource("Central Library", "LIBRARY", 200, "Library Wing, 1st Floor", "07:00-21:00", "AVAILABLE");
        createResource("Computer Lab A", "LABORATORY", 30, "Building A, 3rd Floor", "09:00-17:00", "AVAILABLE");
        createResource("Sports Complex", "SPORTS", 1000, "Behind Main Building", "06:00-20:00", "AVAILABLE");
        createResource("Medical Clinic", "MEDICAL", 25, "Health Center, Building C", "08:00-16:00", "AVAILABLE");

        System.out.println("=========================================");
        System.out.println("✅  Smart Campus demo data seeded.");
        System.out.println("🎫  Tickets → 5 demo tickets with statuses");
        System.out.println("🏛️   Resources → 8 facilities & assets");
        System.out.println("🚀  API  → http://localhost:9091/api/tickets");
        System.out.println("      → http://localhost:9091/api/resources");
        System.out.println("🗄️   DB   → configured from MONGODB_URI (.env)");
        System.out.println("👤  Users → ali / sara / admin @campus.edu");
        System.out.println("=========================================");
    }

    // ── Helpers ───────────────────────────────────────────────

    private User createUser(String name, String email, UserRole role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setRole(role);
            return userRepository.save(u);
        });
    }

    private Ticket createTicket(String title, String description, String location,
                                Category category, Priority priority, TicketStatus status,
                                User reportedBy, String assignedTech, String resolutionNotes) {
        Ticket t = new Ticket();
        t.setTitle(title);
        t.setDescription(description);
        t.setLocation(location);
        t.setCategory(category);
        t.setPriority(priority);
        t.setStatus(status);
        t.setReportedById(reportedBy.getId());
        t.setReportedByName(reportedBy.getName());
        t.setReportedByEmail(reportedBy.getEmail());
        t.setReportedByRole(reportedBy.getRole());
        t.setContactName(reportedBy.getName());
        t.setContactEmail(reportedBy.getEmail());
        t.setAssignedTechnician(assignedTech);
        t.setResolutionNotes(resolutionNotes);
        return ticketRepository.save(t);
    }

    private void addComment(Ticket ticket, String authorName,
                            String authorRole, String content) {
        Comment c = new Comment();
        c.setTicketId(ticket.getId());
        c.setAuthorName(authorName);
        c.setAuthorRole(authorRole);
        c.setContent(content);
        commentRepository.save(c);
    }

    private void createResource(String name, String type, int capacity,
                                String location, String availabilityWindows, String status) {
        Resource r = new Resource();
        r.setName(name);
        r.setType(type);
        r.setCapacity(capacity);
        r.setLocation(location);
        r.setAvailabilityWindows(availabilityWindows);
        r.setStatus(status);
        resourceRepository.save(r);
    }
}
