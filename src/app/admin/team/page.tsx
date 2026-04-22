"use client";
import ResourceList from "../components/ResourceList";
import { teamConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={teamConfig} />;
}
