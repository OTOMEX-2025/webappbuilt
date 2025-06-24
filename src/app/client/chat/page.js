import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';
import { useTheme } from '@/context/ThemeContext';

function Page() {
  const { theme } = useTheme();
  
  // This component will only be rendered on the client side  
  const ClientSideChatComponent = dynamic(
    () => import('./ChatContent.client'),
    { 
      ssr: false,
      loading: () => <Loader theme={theme}/> // Optional loading component
    }
  );

  return (
    <div>
      <h1>My Page</h1>
      <ClientSideChatComponent />
    </div>
  );
}

export default Page;