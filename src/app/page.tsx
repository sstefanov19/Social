"use client";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Introduction from "~/app/_components/Introduction";
import MontlyPosts from "~/app/_components/MontlyPosts";

const client = new QueryClient();
export default function HomePage() {

  return (
    <QueryClientProvider client={client}>
   <div className="h-screen">
    <Introduction/>
    <MontlyPosts />
   </div>
    </QueryClientProvider>
  );
}
