export const links = [
  {
    name: "Home",
    link: "/",
    description: "Return to the homepage",
  },
  {
    name: "Authentication",
    menu: [
      {
        name: "Sign In",
        link: "/auth/signin",
        description: "Access your account with email and password",
      },
      {
        name: "Sign Up",
        link: "/auth/signup",
        description: "Create a new account",
      },
      {
        name: "Passwordless Login",
        link: "/auth/signin?email_link",
        description: "Sign in without a password using magic links",
      },
      {
        name: "Forgot Password",
        link: "/auth/forgot-password",
        description: "Reset your password if you've forgotten it",
      },
    ],
  },
];

export const admin_dashboard_links = [
  {
    title: "📚 Courses",
    url: "/",
    isActive: true,
    breadcrumb: [
      {
        title: "📚 Courses",
        url: "/",
      },
    ],
    items: [
      {
        title: "📖  All Courses",
        url: "/dashboard/admin/courses/all",
        breadcrumb: [
          {
            title: "📚 Courses",
            url: "/",
          },
          {
            title: "📖 All Courses",
            url: "/",
          },
        ],
      },
      {
        title: "🗂️  Categories",
        url: "/dashboard/admin/categories",

        breadcrumb: [
          {
            title: "📚 Courses",
            url: "/dashboard/admin/courses",
          },
          {
            title: "🗂️ Categories",
            url: "/dashboard/admin/categories",
          },
        ],
      },
      {
        title: "🗃️  Subcategories",
        url: "/dashboard/admin/subcategories",
        breadcrumb: [
          {
            title: "📚 Courses",
            url: "/",
          },
          {
            title: "🗃️ Subcategories",
            url: "/",
          },
        ],
      },
      {
        title: "📝 Review Courses",
        url: "/dashboard/admin/courses/review",
        breadcrumb: [
          {
            title: "📚 Courses",
            url: "/",
          },
          {
            title: "📝 Review Submitted Courses",
            url: "/",
          },
        ],
      },
    ],
  },
  {
    title: "👨‍🏫 Instructors / Users",
    url: "/",
    breadcrumb: [
      {
        title: "👨‍🏫 Instructors / Users",
        url: "/",
      },
    ],
    items: [
      {
        title: "🧑‍🎓  Students",
        url: "/dashboard/admin/students",
        breadcrumb: [
          {
            title: "👨‍🏫 Instructors / Users",
            url: "/",
          },
          {
            title: "🧑‍🎓 Students",
            url: "/",
          },
        ],
      },
      {
        title: "👨‍🏫  Instructors",
        url: "/dashboard/admin/instructors",
        breadcrumb: [
          {
            title: "👨‍🏫 Instructors / Users",
            url: "/",
          },
          {
            title: "👨‍🏫 Instructors",
            url: "/",
          },
        ],
      },
      {
        title: "📋  Enrollments",
        url: "/dashboard/admin/enrollments",
        breadcrumb: [
          {
            title: "👨‍🏫 Instructors / Users",
            url: "/",
          },
          {
            title: "📋 Enrollments",
            url: "/",
          },
        ],
      },
    ],
  },
  /*
  {
    title: "🛒 Sales & Subscriptions",
    url: "/",
    breadcrumb: [
      {
        title: "🛒 Sales & Subscriptions",
        url: "/",
      },
    ],
    items: [
      {
        title: "📦  Orders",
        url: "/",
        breadcrumb: [
          {
            title: "🛒 Sales & Subscriptions",
            url: "/",
          },
          {
            title: "📦 Orders",
            url: "/",
          },
        ],
      },
      {
        title: "🔁  Subscriptions",
        url: "/",
        breadcrumb: [
          {
            title: "🛒 Sales & Subscriptions",
            url: "/",
          },
          {
            title: "🔁 Subscriptions",
            url: "/",
          },
        ],
      },
      {
        title: "🎟️  Coupons",
        url: "/",
        breadcrumb: [
          {
            title: "🛒 Sales & Subscriptions",
            url: "/",
          },
          {
            title: "🎟️ Coupons",
            url: "/",
          },
        ],
      },
      {
        title: "💸  Refund Requests",
        url: "/",
        breadcrumb: [
          {
            title: "🛒 Sales & Subscriptions",
            url: "/",
          },
          {
            title: "💸 Refund Requests",
            url: "/",
          },
        ],
      },
    ],
  },
 */
];
export const instructor_dashboard_links = [
  {
    title: "📚 Courses",
    url: "/",
    isActive: true,
    breadcrumb: [
      {
        title: "📚 Courses",
        url: "/",
      },
    ],
    items: [
      {
        title: "📖  All Courses",
        url: "/dashboard/instructor/courses/all",
        breadcrumb: [
          {
            title: "📚 Courses",
            url: "/dashboard/instructor/courses",
          },
          {
            title: "📖 All Courses",
            url: "/dashboard/instructor/courses/all",
          },
        ],
      },
      {
        title: "➕  Create Course",
        url: "/dashboard/instructor/courses/new",
        breadcrumb: [
          {
            title: "📚 Courses",
            url: "/dashboard/instructor/courses",
          },
          {
            title: "➕ Create Course",
            url: "/dashboard/instructor/courses/new",
          },
        ],
      },
    ],
  },
];

export const course_dashboard_links = [
  {
    title: "Course editing",
    url: "/",
    items: [
      {
        title: "Intended Learners",
        url: "/manage/intended-learners",
        breadcrumb: [
          {
            title: "Intended Learners",
            url: "/manage/intended-learners",
          },
        ],
      },
      {
        title: "Objectives",
        url: "/manage/objectives",
        breadcrumb: [
          {
            title: "Objectives",
            url: "/manage/objectives",
          },
        ],
      },
      {
        title: "Prerequisites",
        url: "/manage/prerequisites",
        breadcrumb: [
          {
            title: "Prerequisites",
            url: "/manage/prerequisites",
          },
        ],
      },
      {
        title: "Curriculum",
        url: "/manage/curriculum",
        breadcrumb: [
          {
            title: "Curriculum",
            url: "/manage/curriculum",
          },
        ],
      },
      {
        title: "Course landing page",
        url: "/manage/landing",
        breadcrumb: [
          {
            title: "Course landing page",
            url: "/manage/landing",
          },
        ],
      },
    ],
  },
  {
    title: "Course management",
    url: "/",
    items: [
      {
        title: "Pricing",
        url: "/manage/pricing",
        breadcrumb: [
          {
            title: "Pricing",
            url: "/manage/pricing",
          },
        ],
      },

      {
        title: "Promotions",
        url: "/manage/promotions",
        breadcrumb: [
          {
            title: "Promotions",
            url: "/manage/promotions",
          },
        ],
      },
      {
        title: "Course messages",
        url: "/manage/messages",
        breadcrumb: [
          {
            title: "Course messages",
            url: "/manage/messages",
          },
        ],
      },
      {
        title: "Students",
        url: "/manage/students",
        breadcrumb: [
          {
            title: "Students",
            url: "/manage/students",
          },
        ],
      },
    ],
  },
];
