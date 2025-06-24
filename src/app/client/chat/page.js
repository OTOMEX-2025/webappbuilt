import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';
// This component will only be rendered on the client side
const ClientSideChatComponent = dynamic(
  () => import('./ChatContent.client'),
  { 
    ssr: false,
    loading: () => <p>Loading...</p>// Optional loading component
  }
);

function Page() {
  return (
    <div>
      <ClientSideChatComponent />
    </div>
  );
}

export default Page;