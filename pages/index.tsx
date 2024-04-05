import Yolo from "@/components/models/yolo";
import "@/controllers/init";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { Fragment } from "react";

const AddToHomeScreen = dynamic(
  () => import("@ideasio/add-to-homescreen-react"),
  {
    ssr: false,
  }
);

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Fragment>
      <AddToHomeScreen />
      <Yolo />;
    </Fragment>
  );
}
