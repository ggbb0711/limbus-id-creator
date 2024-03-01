export interface IActiveSkillEffect{
    trigger:string,
    effect:string,
} 

export class ActiveSkillEffect implements IActiveSkillEffect{
    trigger: string = "";
    effect: string = "";
}