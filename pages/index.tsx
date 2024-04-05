import Yolo from "@/components/models/yolo";
import "@/controllers/init";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <main className="font-mono flex flex-col justify-center items-center  w-screen">
        <Yolo />
      </main>
    </main>
  );
}
