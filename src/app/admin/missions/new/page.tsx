"use client";
import ResourceForm from "../../components/ResourceForm";
import { missionsConfig } from "../../components/configs";

export default function Page() {
  return <ResourceForm config={missionsConfig} />;
}
