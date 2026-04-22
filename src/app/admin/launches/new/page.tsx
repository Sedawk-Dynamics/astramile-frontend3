"use client";
import ResourceForm from "../../components/ResourceForm";
import { launchesConfig } from "../../components/configs";

export default function Page() {
  return <ResourceForm config={launchesConfig} />;
}
