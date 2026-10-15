
export const canCreateSession = (planType?: string, sessionCreation: number = 0): boolean => {
  const plan = (planType || 'basic').toLowerCase();

  switch (plan) {
    case 'basic':
      //return sessionCreation < 1;
      return true;
      
    case 'plus':
      //return sessionCreation < 10;
      return true;
      
    case 'pro':
      return true;
      
    default:
      return sessionCreation < 1;
  }
};
