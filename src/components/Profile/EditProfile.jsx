import React from "react";
import { FiEdit2 } from "react-icons/fi";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import Field from "./Field";

export default function EditProfile({ tab, setTab }) {
  return (
    <Card>
      <SectionTitle
      >
        Edit Info
      </SectionTitle>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Name :">
          <input className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="Ethan sage" />
        </Field>
        <Field label="Email :">
          <input className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="Ethansage123@gmail.com" />
        </Field>
        <Field label="Password :">
          <input type="password" className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="Ethansage123@gmail.com" />
        </Field>
        <Field label="Username :">
          <input className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="ethansage444" />
        </Field>
        <Field label="Date Of Birth :">
          <input className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="27-08-2025" />
        </Field>
        <Field label="Phone Number :">
          <input className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="+974 2345 456" />
        </Field>
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <button onClick={() => setTab("profile")} className="rounded-lg text-sm bg-primary_light_mode hover:bg-primary_light_mode/10 px-4 py-2 font-semibold text-primary shadow">
          Cancel
        </button>
        <button className="rounded-lg text-sm bg-primary px-4 py-2 font-semibold text-white shadow hover:bg-primary/80">
          Update
        </button>
      </div>

    </Card>
  );
}
