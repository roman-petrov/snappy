const name = (id: string) => (modelId: string) => modelId === id || modelId.endsWith(`/${id}`);

export const Matches = { name };
