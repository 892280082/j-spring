import {SqliteStarter} from './starter'
import {TxParamInteceptor} from './interceptor'

export * from './annotation'

export const SqliteModule = [SqliteStarter,TxParamInteceptor]