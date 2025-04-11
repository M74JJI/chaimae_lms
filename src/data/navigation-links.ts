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
