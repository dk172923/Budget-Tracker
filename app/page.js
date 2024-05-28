import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Head from "next/head";

export default function Home() {
  return (
   <div>
      <Head>
        <title>Budget Tracker</title>
        <link rel="icon" href="./image.png" />
      </Head>
      <Header/>
      <Hero/>
   </div>
  );
}
