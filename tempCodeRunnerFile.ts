
// parameter‑decorator signature (legacy/experimental)
function gg(
  target: object,          // prototype of class A
  propertyKey: string | symbol,
  parameterIndex: number   // 0 for first parameter
) {
  console.log(`Parameter #${parameterIndex} of ${String(propertyKey)} in`, target);
}

class A {
  foo(@gg a: any) {}
}
