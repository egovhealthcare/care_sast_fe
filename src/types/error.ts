export interface PydanticErrorItem {
    type: string;
    loc: (string | number)[];
    msg: string;
    input?: unknown;
  }
  
  export interface EMRErrorResponse {
    errors: PydanticErrorItem[] | { type: string; msg: string }[];
  }
  