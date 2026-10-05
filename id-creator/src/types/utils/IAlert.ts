export type AlertStatus = "Success" | "Failure"

export interface IAlert {
    status: AlertStatus
    msg: string
    alertId: string
}
