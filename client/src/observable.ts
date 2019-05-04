export const refreshObservable: { refreshFn: () => Promise<boolean> } = {
  refreshFn: () => {
    throw new Error("No refresh function registered");
  }
};
