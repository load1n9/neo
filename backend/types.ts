export type BackendType = "js" | "wasm" | "webgpu";
export type DataType = "u32" | "i32" | "f32";
// deno-fmt-ignore
export type DataArray<T extends DataType> = 
    T extends "u32" ? Uint32Array
  : T extends "i32" ? Int32Array
  : T extends "f32" ? Float32Array
  : never;
// deno-fmt-ignore
export type DataArrayConstructor<T extends DataType> = 
    T extends "u32" ? Uint32ArrayConstructor
  : T extends "i32" ? Int32ArrayConstructor
  : T extends "f32" ? Float32ArrayConstructor
  : never;
export const DataArrayConstructor = {
  "u32": Uint32Array,
  "i32": Int32Array,
  "f32": Float32Array,
} as const;

export interface Data<T extends DataType = DataType> {
  type: T;
  backend: Backend;
  length: number;

  set(data: DataArray<T>): Promise<void>;
  get(): Promise<DataArray<T>>;
  dispose(): void;
}

export interface Backend {
  type: BackendType;
  initalized: boolean;
  supported: boolean;

  initialize(): Promise<void>;
  execute(request: BackendRequest): Promise<void>;
}

export interface BackendRequest<T extends DataType = DataType> {
  data: Data<T>[];
}
