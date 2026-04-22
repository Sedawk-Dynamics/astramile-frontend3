"use client";
import ResourceList from "../components/ResourceList";
import { launchesConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={launchesConfig} />;
}
