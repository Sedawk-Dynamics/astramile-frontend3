"use client";
import ResourceList from "../components/ResourceList";
import { statsConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={statsConfig} />;
}
