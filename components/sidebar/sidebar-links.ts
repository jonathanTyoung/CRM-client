export const sidebarLinks = [
  // ------------------------
  // MAIN
  // ------------------------
  {
    section: "Main",
    items: [{ href: "/dashboard", label: "Dashboard" }],
  },

  // ------------------------
  // CRM SECTION
  // ------------------------
  {
    section: "CRM",
    items: [
        { href: "/contacts", label: "Contacts" },
        { href: "/leads", label: "Leads" },
      {
        href: "/opportunities",
        label: "Opportunities",
        children: [
          { href: "/opportunities/new", label: "New Opportunity" },
          { href: "/opportunities", label: "Current Opportunities" },
        ],
      },
      {
        href: "/tasks",
        label: "Tasks",
        children: [
          { href: "/tasks", label: "My Tasks" },
          { href: "/tasks/new", label: "New Task" },
        ],
      },
      // ⭐ NEW: Phase 1 Reports Placeholder
      { href: "/reports", label: "Reports" },
    ],
  },

  // ------------------------
  // LISTINGS (IDX)
  // ------------------------
  {
    section: "Listings",
    items: [{ href: "/listings/search", label: "Property Search" }],
  },

  // ------------------------
  // COMMUNICATION SECTION
  // ------------------------
  {
    section: "Communication",
    items: [
      { href: "/inbox", label: "Inbox" }, // Gmail integration
      { href: "/calendar", label: "Calendar" }, // Google Cal or local scheduling
    ],
  },

  // ------------------------
  // MY ACCOUNT SECTION
  // ------------------------
  {
    section: "My Account",
    items: [
      { href: "/profile", label: "Profile" },
      { href: "/settings", label: "Settings" },
      { href: "/logout", label: "Logout", isLogout: true }, // handled in Sidebar.tsx
    ],
  },

  // ------------------------
  // ADMIN SECTION (Admins only)
  // ------------------------
  {
    section: "Admin",
    adminOnly: true,
    items: [
      { href: "/admin/agents", label: "Agents" },
      { href: "/admin/routing", label: "Lead Routing" },
      { href: "/admin/mls", label: "MLS / IDX Settings" },
      { href: "/admin/billing", label: "Billing" },
    ],
  },
];
