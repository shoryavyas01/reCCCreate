import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "ReCCCreate", short_name: "ReCCCreate", description: "Temple flowers remade as rangoli colour and flower compost in Jaipur.", start_url: "/", display: "browser", background_color: "#ead8b6", theme_color: "#173e36", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }] };
}
