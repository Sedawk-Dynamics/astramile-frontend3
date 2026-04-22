"use client";
import ResourceForm from "../../components/ResourceForm";
import { crewConfig } from "../../components/configs";

export default function Page() {
  return <ResourceForm config={crewConfig} />;
}
