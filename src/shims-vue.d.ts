declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare type ParamType<T> = () => T;
declare type RequestParamType<T, U> = T extends () => void ? ReturnType<T> : U;
