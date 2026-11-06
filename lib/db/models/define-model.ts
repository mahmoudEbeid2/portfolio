import { model, models, type Model, type Schema } from "mongoose";

/** Registers a model once, so hot reloads don't compile it twice. */
export function defineModel<T>(name: string, schema: Schema<T>): Model<T> {
  return (models[name] ?? model(name, schema)) as unknown as Model<T>;
}
