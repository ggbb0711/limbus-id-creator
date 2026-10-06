import IResponse from "types/IResponse"

export const unwrapData = <T,>(response: IResponse<T>): T => response.data
