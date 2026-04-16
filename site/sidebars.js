/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  learnSidebar: [
    'index',
    'glossary',
    'tags-reference',
    {
      type: 'category',
      label: '4th Grade Curriculum',
      items: [
        'courses/elementary-4th-grade/index',
        'courses/elementary-4th-grade/teacher-setup',
        'courses/elementary-4th-grade/classroom-norms',
        'courses/elementary-4th-grade/week-1-welcome',
        'courses/elementary-4th-grade/week-2-writing',
        'courses/elementary-4th-grade/week-3-math',
        'courses/elementary-4th-grade/week-4-science',
        'courses/elementary-4th-grade/week-5-social-studies',
        'courses/elementary-4th-grade/week-6-capstone',
        'courses/elementary-4th-grade/rubrics',
        'courses/elementary-4th-grade/worksheets',
        'courses/elementary-4th-grade/parent-letter',
        'courses/elementary-4th-grade/admin-guide',
      ],
    },
    // --- Future courses (uncomment as they ship) ---
    // {
    //   type: 'category',
    //   label: 'HS Biology: The Human Brain & the Are-Self',
    //   items: ['courses/hs-bio-brain/index'],
    // },
    // {
    //   type: 'category',
    //   label: 'CS Frameworks: Django, DRF, Are-Self',
    //   items: ['courses/cc-frameworks-django/index'],
    // },
    // {
    //   type: 'category',
    //   label: 'Corporate AI Cost Management',
    //   items: ['courses/corporate-ai-cost-management/index'],
    // },
  ],
};

module.exports = sidebars;
