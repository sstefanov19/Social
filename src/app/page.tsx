"use client";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Introduction from "~/app/_components/Introduction";
import MontlyPosts from "~/app/_components/MontlyPosts";
import ExplorePosts from './_components/ExplorePosts';
import Footer from './_components/Footer';

const client = new QueryClient();
export default function HomePage() {

  return (
    <QueryClientProvider client={client}>
   <div className="mt-32 min-h-screen">
    <Introduction/>
    <MontlyPosts />
    <ExplorePosts />
   </div>
    </QueryClientProvider>
  );
}
