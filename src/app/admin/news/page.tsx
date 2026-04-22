"use client";
import ResourceList from "../components/ResourceList";
import { newsConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={newsConfig} />;
}
