"use client";
import ResourceList from "../components/ResourceList";
import { blogConfig } from "../components/configs";

export default function Page() {
  return <ResourceList config={blogConfig} />;
}
