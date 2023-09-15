import dynamic from "next/dynamic";

export const L = dynamic(() => import("leaflet"), { ssr: false });