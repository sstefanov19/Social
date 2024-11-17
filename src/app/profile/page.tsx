"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
};

export default function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<User | undefined>(undefined);


  const fetchUserProfile = async (userId: string) => {
    const response = await fetch(`/api/user?userId=${userId}`, {
        method: "GET",
      });

      console.log(response);

      if(!response.ok) throw new Error("Failed to fetch user profile");

      const data = (await response.json()) as User;
      setProfile(data);
    setProfile(data);
  };

  useEffect(() => {
    if (user?.id) {
        console.log(user.id);
      void fetchUserProfile(user.id);
    }
  }, [user]);

  return (
    <section className="mt-12 flex h-screen w-full justify-center">
      <div className="mt-12 h-[400px] w-4/5 border-2">
        <h1 className="text-center text-2xl font-bold text-zinc-200">
          Profile
        </h1>
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-[100px] h-[100px] rounded-full bg-slate-200 overflow-hidden">
              <div className="absolute inset-0 w-[100px] h-[100px] flex items-center justify-center">
                <UserButton />
              </div>
            </div>
            {profile && (
              <>
                <h2 className="text-xl text-zinc-200 text-cen font-semibold">{profile.name}</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, voluptas.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
