import IResponse from "types/IResponse";

export default function getApiErrorMessage(error:unknown, fallback = "Something went wrong with the server"):string{
    const data = (error as { data?: Partial<IResponse<unknown>> } | undefined)?.data
    if(data && typeof data === "object" && typeof data.message === "string" && data.message) return data.message
    return fallback
}
