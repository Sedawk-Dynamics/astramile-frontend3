"use client";
import ResourceList from "../components/ResourceList";
import { rocketsConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={rocketsConfig} />;
}
