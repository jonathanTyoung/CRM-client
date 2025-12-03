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

          // ⭐ Future: Lead imports (Facebook, Google, CSV)
          { label: "Imported Leads", href: "/leads/imported" },

          // ⭐ Industry-standard lead status buckets
          {
            label: "Lead Status",
            children: [
              { label: "New", href: "/leads/status/new" },
              { label: "Attempted Contact", href: "/leads/status/attempted" },
              { label: "Contacted", href: "/leads/status/contacted" },
              { label: "Qualified", href: "/leads/status/qualified" },
              { label: "Converted", href: "/leads/status/converted" },
              { label: "Archived", href: "/leads/status/archived" },
            ],
          },
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
