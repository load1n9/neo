import { DataType } from "../../types.ts";
import { ensureType } from "../../util.ts";
import { WebGPUBackend } from "../backend.ts";
import { WebGPUData } from "../data.ts";
import { pad as shader } from "../shaders/pad.ts";

export async function pad<T extends DataType>(
  backend: WebGPUBackend,
  a: WebGPUData<T>,
  b: WebGPUData<T>,
  { w, h, t }: { w: number; h: number; t: number },
) {
  const type = ensureType(a.type, b.type);
  const pipeline = await backend.register(shader(type));
  const uniform = await WebGPUData.from(
    backend,
    new Uint32Array([w, h, t]),
    GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  );

  await backend.execute({
    pipeline,
    data: [a, b, uniform],
    workgroups: [Math.ceil(w / 8), Math.ceil(h / 8), 1],
  });
}
