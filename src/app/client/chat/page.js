import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';
// This component will only be rendered on the client side
const ClientSideChatComponent = dynamic(
  () => import('./ChatContent.client.client'),
  { 
    ssr: false,
    loading: () => <Loader theme={theme}/> // Optional loading component
  }
);

function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <ClientSideChatComponent />
    </div>
  );
}

export default Page;