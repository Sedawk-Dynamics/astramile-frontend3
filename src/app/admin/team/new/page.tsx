"use client";
import ResourceForm from "../../components/ResourceForm";
import { teamConfig } from "../../components/configs";

export default function Page() {
  return <ResourceForm config={teamConfig} />;
}
