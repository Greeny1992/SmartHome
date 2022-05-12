export interface User {
    _id?: string;
    userName: string;
    fullName: string;
    email: string;
    password: string;
}

export interface authentication {
    token: string;
    expirationDate: number;
}

export interface AuthenticationResponse {
    authentication: authentication | null;
    user: User | null;
}

export interface LoginData {
    username: string,
    password: string
}

export interface Sample
{
    tag : string;
    timeSamp: Date;
    value: string;
}

export interface Value
{
    sample : Sample;
    dataPoint : DataPoint;
    visuals: Visuals | null;
}

export type ValueList = Value[]

export interface DataPoint
{
    id: string;
    name: string;
    description: string;
    databaseName : string;
    dataType: string;
    dataSource: string;
    offset: number;
}

export interface Visuals
{
    icon : string;
    minValue : number | null;
    maxValue : number | null;
    unit : string | null;
    valueText : string;
    thresholds: Thresholds | null;
    finalText : string | null;
}

export interface Threshold
{
    alarmType : string;
    value : number;
    alarmCheckType: string;
}
export interface Thresholds
{
    Warning: Threshold | null;
    Alarm : Threshold | null;
    Trip: Threshold | null;
}