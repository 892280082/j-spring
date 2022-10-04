

//初始化配置文件
let configMap = new Map<string,any>();

//加载配置
export const loadResourceConfig = function(data:any,prefixKey?:string){
    
    prefixKey = prefixKey ? `${prefixKey}.` : '';

    for(let key of Object.keys(data)){

        const value = data[key];
        const setKey = prefixKey+key;

        if(typeof value === 'object'){
            loadResourceConfig(value,setKey)
        }else{
            configMap.set(setKey,value)
        }

    }

}

type formatType = {
    type:Function;
    doFormat:(value:any,key:string)=>any;
}

const formTypeList:formatType[] = [
    {
        type:String,
        doFormat:(value) => ""+value
    },
    {
        type:Number,
        doFormat:(value:any,key:string) => {
            const n = +value;
            if(Number.isNaN(n))
                throwError(key,`value:${value} is NaN`)
            return n;
        }
    },
    {
        type:Object,
        doFormat:(v) => v
    },
    {
        type:Boolean,
        doFormat:(v:any) => {
            if(typeof v === 'string' && v === 'true'){
               return true;
            }
            return v === true;
        }
    }
]


//获取配置信息
export const getConfigMap = ()=>configMap;

//是否存在指定配置
export const hasConfig = (key:string):boolean => configMap.has(key);

//验证配置
export const validateType = (type:Function):boolean => formTypeList.map(f => f.type).indexOf(type) > -1;

//验证类型是否正确
export const vlidateTypeAndThrowError = (path:string,type:Function) => {
    if(!validateType(type))
        throw Error(`[SPRING_RESOURCE_ERROR]: key:${path} type error.just only support [String|Number|Object|Boolean]`)
}

const throwError = (path:string,msg:string):void => { throw Error(`[SPRING_RESOURCE_ERROR: path[${path}] reason[${msg}] `) };


//格式化值
export const geFormatValue = (key:string,type:Function) => {

    if(!hasConfig(key)){
        throwError(key,'not find')
    }

    vlidateTypeAndThrowError(key,type);

    const value = configMap.get(key);

    // if(type === Object)
    //     return value;

    // if(type === String){
    //     return ''+value;
    // }

    // if(type === Number){
    //     const n = +value;
    //     if(Number.isNaN(n))
    //         throwError(key,`value:${value} is NaN`)
    //     return n;
    // }

    // if(type === Boolean){
    //     return new Boolean(value);
    // }

    const form = formTypeList.find(f => f.type === type)

    if(form){
        return form.doFormat(value,key);
    }else{
        return throwError(key,'type not match')
    }
  
}