export interface EmscriptenModule {
  ccall: (...args: any[]) => any;
  cwrap: <T extends (...args: any[]) => any>(
    ident: string,
    returnType: string | null,
    argTypes?: string[]
  ) => T;
  UTF8ToString: (ptr: number) => string;
  _free?: (ptr: number) => void;
  HEAPU8: Uint8Array;
  [key: string]: any;
}

export interface ModuleFactoryOptions {
  locateFile?: (path: string, scriptDirectory?: string) => string;
  [key: string]: any;
}

export default function createModule(
  options?: ModuleFactoryOptions
): Promise<EmscriptenModule>;
