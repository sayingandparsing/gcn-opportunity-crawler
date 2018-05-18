
import * as cheerio from 'cheerio'
import * as rp from 'request-promise'
import {RequestPromiseOptions} from 'request-promise'
//import UrlOptions from 'request'
//import {Maybe, Just} from 'sanctuary'



/**
 * Exposes methods used to fetch content from web services
 */
export class RequestChannel {

    baseUrl: string
    
    constructor(baseUrl ?:string) {
        this.baseUrl = baseUrl
    }

    /**
     * 
     * @param uri 
     * @param callback 
     * @param options 
     * @param onFail 
     */
    async fetchPage(url      :string, 
                    callback :(String)=>void,
                    options? :RequestPromiseOptions,
                    onFail?  :(ExceptionInformation)=>void) {
        return await rp(
            options
                ? {url: url, ...options}
                : {url: url}
        )
            /*.then(res => {callback(res)})
            .catch(err =>
                onFail 
                    ? onFail(err) 
                    : this.logFailure(err))*/
    }
  

    specify = (uri :string) :string =>
        this.baseUrl + '/' + uri


    logFailure(err) {
        console.log('erred')
        console.log(err); 
    }

    /**
     * Namespace for private utility functions
     */
    util = class {
        a = () => "hello"

    }
}