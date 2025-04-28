const validEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export default validEmail;
  
  // helper.ts (or helper.js if not using TypeScript)
export const getInitials = (name: string): string => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0];
  }

  return initials.toUpperCase();
};

  