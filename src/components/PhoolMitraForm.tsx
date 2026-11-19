"use client";

import FormShell from "./FormShell";
import { frequencies, sendSignup } from "@/lib/phoolMitra";

export default function PhoolMitraForm({ disabledReason }: { disabledReason?: string }) {
  return <FormShell send={sendSignup} disabledReason={disabledReason} subject="New Phool Mitra sign-up" submitLabel="Sign up as a Phool Mitra" thanks="Thank you for joining. Someone from the ReCCCreate team will message you on WhatsApp to tell you where your nearest drop-off point is.">
    <div><label className="label" htmlFor="name">Full name</label><input className="field" id="name" name="name" required minLength={2} maxLength={100} autoComplete="name" /></div>
    <div><label className="label" htmlFor="phone">Phone number <span className="font-normal text-[#5d614b]">(WhatsApp)</span></label><input className="field" id="phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" pattern="^\s*(\+?91|0)?[\s\-]*[6-9](\s*\d){9}\s*$" title="A 10-digit Indian mobile number" placeholder="98765 43210" /></div>
    <div><label className="label" htmlFor="area">Area or locality in Jaipur</label><input className="field" id="area" name="area" required minLength={2} maxLength={100} placeholder="For example: Mansarovar, Vaishali Nagar" /></div>
    <div><label className="label" htmlFor="temples">Nearest temple(s) you can collect from</label><textarea className="field min-h-24 resize-y" id="temples" name="temples" rows={3} required minLength={2} maxLength={300} placeholder="Name and road of one or more temples near you" /></div>
    <div><label className="label" htmlFor="frequency">How often can you collect?</label><select className="field" id="frequency" name="frequency" required defaultValue=""><option value="" disabled>Choose one</option>{frequencies.map((f) => <option key={f}>{f}</option>)}</select></div>
  </FormShell>;
}
