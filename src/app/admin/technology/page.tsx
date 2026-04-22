"use client";
import ResourceList from "../components/ResourceList";
import { technologyConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={technologyConfig} />;
}
