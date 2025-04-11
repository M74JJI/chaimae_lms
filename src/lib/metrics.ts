export function incrementUserSignup(plan: string, source: string) {
  globalThis.metrics?.userSignups.inc({
    plan_type: plan,
    referral_source: source,
  });
}
