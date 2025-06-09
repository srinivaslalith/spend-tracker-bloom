
import { useAuth } from '@/hooks/useAuth';
import { Auth } from '@/pages/Auth';
import { Dashboard } from '@/pages/Dashboard';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <Auth />;
};

export default Index;
