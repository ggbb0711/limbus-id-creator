import { JSXElementConstructor, ReactElement } from "react";

export interface IStatusEffect{
    name:string,
    replaceEl:ReactElement,
    effectColor:string,
    statusImg:string
}

export class StatusEffect implements IStatusEffect{
    replaceEl: ReactElement<any, string | JSXElementConstructor<any>>;
    statusImg: string;
    name: string;
    effectColor: string;
}