export interface Subscriber { email: string; token: string; }
export async function sendConfirmation(_s: Subscriber): Promise<void> {
  // EPIC-05 wires Buttondown double opt-in. EPIC-01 intentionally does not send.
  return;
}
