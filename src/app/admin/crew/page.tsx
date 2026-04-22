"use client";
import ResourceList from "../components/ResourceList";
import { crewConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={crewConfig} />;
}
