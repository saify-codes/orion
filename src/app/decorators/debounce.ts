// debounce.decorator.ts
export function debounce(wait = 300): MethodDecorator {
    return (_target, propertyKey, descriptor: PropertyDescriptor) => {
      const original = descriptor.value as (...args: any[]) => any;
  
      // unique keys so multiple methods can be debounced independently
      const timerKey = Symbol(`__debounce_timer_${String(propertyKey)}`);
  
      descriptor.value = function (...args: any[]) {
        const self = this as any;
        const existing: ReturnType<typeof setTimeout> | null = self[timerKey] ?? null;
  
        if (existing) {
          clearTimeout(existing);
        }
  
        self[timerKey] = setTimeout(() => {
          original.apply(self, args);
          self[timerKey] = null;
        }, wait);
      };
  
      return descriptor;
    };
  }
  