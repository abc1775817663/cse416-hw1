// import Script from "next/script";
import Head from "next/head";

export default function SetScript(){
    return (
        <Head>
            <script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.2.0/leaflet-omnivore.min.js' />
        </Head>
    );
}