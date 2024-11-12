import React from "react";
import {Button} from '~/components/ui/button';


export default function Introduction() {
  return <section className="h-1/3 flex justify-center items-center">

      <div className="flex flex-col items-center ">
        <h1 className="text-4xl text-center text-white font-semibold">Welcome to DevBlog</h1>
        <p className="text-center text-white">A place where developers share their thoughts and ideas</p>
        <Button className="mt-4">Share your thoughts</Button>
      </div>
  </section>;
}
