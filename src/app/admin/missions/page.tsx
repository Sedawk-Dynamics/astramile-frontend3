"use client";
import ResourceList from "../components/ResourceList";
import { missionsConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={missionsConfig} />;
}
