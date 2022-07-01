declare interface IDumpBMPResult {
  base64: string;
  width: number;
  height: number;
  info?: {
    width: number;
    height: number;
    px: number;
    py: number;
  };
}
