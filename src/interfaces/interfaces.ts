export interface IProps {
    period?:string;
    precision?:string;
}

export interface ISuccessResponse {
Close: number | string;
Date:string;
High: number |string;
Low: number |string;
Open: number |string;
StartDate: string;
StartTime: string;
Volume: number |string;
}