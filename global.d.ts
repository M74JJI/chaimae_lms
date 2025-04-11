// types.d.ts
declare namespace NodeJS {
  interface Module {
    hot?: {
      dispose: (callback: () => Promise<void> | void) => void;
      // Add other HMR methods you might use
      accept?: () => void;
      data?: any;
    };
  }
}
