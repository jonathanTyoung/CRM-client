export const sidebarLinks = [
  {
    section: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      {
        label: "Contacts",
        href: "/contacts",
        children: [
          { label: "All Contacts", href: "/contacts" },
          { label: "New Contact", href: "/contacts/new" },
        ],
      },
      {
        label: "Leads",
        href: "/leads",
        children: [
          { label: "All Leads", href: "/leads" },
          { label: "New Lead", href: "/leads/new" },
        ],
      },
      {
        label: "Opportunities",
        href: "/opportunities",
        children: [
          { label: "Current Opportunities", href: "/opportunities" },
          { label: "New Opportunity", href: "/opportunities/new" },
        ],
      },
      { label: "Logout", href: "/logout", isLogout: true },
    ],
  },
];
