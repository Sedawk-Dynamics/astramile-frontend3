"use client";
import ResourceForm from "../../components/ResourceForm";
import { technologyConfig } from "../../components/configs";

export default function Page() {
  return <ResourceForm config={technologyConfig} />;
}
