"use client";
import ResourceList from "../components/ResourceList";
import { galleryConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={galleryConfig} />;
}
